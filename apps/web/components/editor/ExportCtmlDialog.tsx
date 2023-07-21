import React, {useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import styles from './ExportCtmlDialog.module.scss';
import {Message} from "primereact/message";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {RJSFValidationError, ValidationData} from "@rjsf/utils";
import {extractErrors, isObjectEmpty} from "../../../../libs/ui/src/lib/components/helpers";
import {stringify} from 'yaml'
import axios from "axios";
import { RadioButton } from 'primereact/radiobutton';

interface ExportCtmlDialogProps {
  isDialogVisible: boolean;
  exportCtmlClicked: () => void;
  onDialogHide: () => void;
}

const ExportCtmlDialog = (props: ExportCtmlDialogProps) => {
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(props.isDialogVisible);
  const [errors, setErrors] = useState<string[]>([]);
  const [format, setFormat] = useState<string>('JSON');
  const [exportButtonDisabled, setExportButtonDisabled] = useState<boolean>(true);

  const errorSchema: ValidationData<any> = useSelector((state: RootState) => state.finalModelAndErrors.errorSchema);
  const ctmlModel = useSelector((state: RootState) => state.finalModelAndErrors.ctmlModel);
  const trialId = useSelector((state: RootState) => state.context.trialId);
  const isGroupAdmin = useSelector((state: RootState) => state.context.isTrialGroupAdmin);


  useEffect(() => {
    if(ctmlModel === null) {
    console.log('ctmlModel', ctmlModel);
      setExportButtonDisabled(true);
    }
  }, [ctmlModel])

  useEffect(() => {
    setIsDialogVisible(props.isDialogVisible);
  }, [props.isDialogVisible])

  useEffect(() => {
    let errorObjList: RJSFValidationError[] = errorSchema.errors;
    const filteredErrorObjList = errorObjList.filter((errorObj: RJSFValidationError) => {
      return errorObj.message !== 'must be object';
    })
    if (!isObjectEmpty(errorSchema)) {
      const viewModelErrors = extractErrors(filteredErrorObjList);
      setErrors(viewModelErrors)
    }
    else {
      setErrors([]);
    }

  }, [errorSchema])

  useEffect(() => {

    if (errors.length > 0) {
      setExportButtonDisabled(true);
    }
    if (errors.length === 0) {
      if (ctmlModel !== null) {
        setExportButtonDisabled(false);
      }
    }

  }, [errors])

  const onDialogHide = () => {
    props.onDialogHide();
  }

  const footer = (props: {exportCtmlClicked: () => void}) => {
    const {exportCtmlClicked} = props;
    const cancelBtn = `p-button-text ${styles['cancel-btn']}`
    const exportBtn = `${styles['export-btn']}`
    return (
      <div>
        {isGroupAdmin ? <Button label="Cancel" className={cancelBtn} onClick={onDialogHide} /> : null}
        <Button
          label="OK"
          disabled={exportButtonDisabled}
          onClick={isGroupAdmin ? exportCtmlClicked : onDialogHide}
          className={exportBtn}
        />
      </div>
    )
  }

  const errorContent = () => {
    return (
      <>
      <div>To export this trial, changes must be made to {errors.length} sections</div>
      <ul>
        {
          errors.map((error, index) => {
            return <li key={index}>{error}</li>
          })
        }
      </ul>
      </>
    )
  }


  const doExport = () => {

    const move = () => {
      let ctmlModelCopy;
      const age_group = ctmlModel.age_group;
      const trialInformation = ctmlModel.trialInformation;
      ctmlModelCopy = {...ctmlModel, ...trialInformation, ...age_group};
      delete ctmlModelCopy.age_group;
      delete ctmlModelCopy.trialInformation;
      delete ctmlModelCopy.ctml_status;
      delete ctmlModelCopy.nickname;
      return ctmlModelCopy;
    }

    const recordExportEvent = () => {
      const accessToken = localStorage.getItem('ctims-accessToken');
      const headers = {
        'Authorization': 'Bearer ' + accessToken,
      }
      axios.request({
        method: 'post',
        url: `/trials/${trialId}/export`,
        headers
      });
    }

    /**
     * This function fixes instances in the match tree where some genomic nodes have underscores that should be spaces
     * in the cnv_call property.
     * @param json - the json object to be formatted.
     */
    const formatAllGenomicNodes = (json: any): any => {
      if (Array.isArray(json)) {
        return json.map((item) => formatAllGenomicNodes(item));
      } else if (typeof json === 'object' && json !== null) {
        const copy: any = {};
        for (const key in json) {
          if (key === 'cnv_call' && typeof json[key] === 'string') {
            copy[key] = json[key].replace(/_/g, ' ');
          } else {
            copy[key] = formatAllGenomicNodes(json[key]);
          }
        }
        return copy;
      } else {
        return json;
      }
    }

    /**
     * This function fixes instances in the match tree where some values have underscores that should be spaces.
     * @param json - the json object to be formatted.
     */
    const formatMatchTreeLabels = (json: any): any => {
      // For each arm node, format all genomic nodes
      json.treatment_list.step.forEach(obj => {
        obj.arm.map(arm => {
          arm.match = formatAllGenomicNodes(arm.match);
        })
      });
    }

    const ctmlModelCopy = move();
    const writableCtmlModelCopy = JSON.parse(JSON.stringify(ctmlModelCopy));
    formatMatchTreeLabels(writableCtmlModelCopy);
    let ctmlModelString = JSON.stringify(writableCtmlModelCopy, null, 2);
    let fileName = 'ctml-model';
    if (ctmlModel.trialInformation.trial_id !== undefined) {
      fileName = ctmlModel.trialInformation.trial_id;
    }
    fileName += '_' + new Date().toISOString().slice(0, 10)
    if (format === 'YAML') {
      ctmlModelString = stringify(writableCtmlModelCopy);
      fileName += '.yaml';
    } else {
      fileName += '.json';
    }
    const blob = new Blob([ctmlModelString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    recordExportEvent()
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDialogHide();
  }

  return (
    <Dialog header="Validate CTML"
            footer={() => footer({exportCtmlClicked: doExport})}
            visible={isDialogVisible}
            style={{width: '700px', minHeight: '200px'}}
            onHide={onDialogHide}>
      <div>
        {errors.length > 0 && (<Message
          severity="error"
          style={{
            whiteSpace: "pre-line",
            marginLeft: '18px',
            marginBottom: '10px'
          }}
          content={errorContent}
        />)}

      </div>
      {isGroupAdmin ? <div style={{marginLeft: '30px'}}>
        <h2>Export As</h2>
        <div className="field-radiobutton">
          <RadioButton inputId="json" name="json" value="JSON" onChange={(e) => setFormat(e.value)} checked={format === 'JSON'} />
          <label htmlFor="json" className={styles['radio-btn']}>JSON</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="yaml"
            name="json"
            value="YAML"
            onChange={(e) => setFormat(e.value)}
            checked={format === 'YAML'}
            style={{marginTop: '8px'}}
          />
          <label htmlFor="yaml" className={styles['radio-btn']}>YAML</label>
        </div>
      </div> : null}

    </Dialog>
  )
}

export default ExportCtmlDialog
