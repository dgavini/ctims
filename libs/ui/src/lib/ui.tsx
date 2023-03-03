import './ui.module.scss';
import {CSSProperties, useEffect, useRef, useState} from "react";
import CtimsFormComponentMemo from './components/CtimsFormComponent';
import CtimsMatchDialog from './components/CtimsMatchDialog';
import {useDispatch} from "react-redux";
import {resetFormChangeCounter} from "../../../../apps/web/store/slices/modalActionsSlice";
import {
  resetActiveArmId,
  setActiveArmId,
  setCtmlMatchModel
} from "../../../../apps/web/store/slices/matchViewModelSlice";
import {setCtmlModel} from "../../../../apps/web/store/slices/ctmlModelSlice";
import {structuredClone} from "next/dist/compiled/@edge-runtime/primitives/structured-clone";


const containerStyle: CSSProperties = {
  width: '100%',
  marginLeft: '336px',
  marginTop: '60px',
}


/* eslint-disable-next-line */
export interface UiProps {}

export const Ui = (props: UiProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const [armCode, setArmCode] = useState('');
  const [formData, setFormData] = useState({});

  const formRef = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('My component was re-rendered');
  });

  const handleSpecialClick = (formD: any, armCode: string, id: string) => {
    console.log('handleSpecialClick formData: ', formD);
    console.log('handleSpecialClick armCode: ', armCode);
    console.log('handleSpecialClick id: ', id);
    setArmCode(armCode)
    setFormData(formD)
    dispatch(setCtmlMatchModel(structuredClone(formD)))
    dispatch(setActiveArmId(id))
    setIsOpen(true);
  }

  const handleSubmit = (e: any) => {
    console.log(e);
  }

  const onFormChange = (data: any) => {
    console.log('onChange event', data)
    const formDataClone = structuredClone(data.formData)
    dispatch(setCtmlModel(formDataClone))
  }

  const onDialogHideCallback = () => {
    setIsOpen(false);
    dispatch(resetFormChangeCounter())
    dispatch(resetActiveArmId())
    const formDataClone = structuredClone(formRef.current.state.formData)
    dispatch(setCtmlModel(formDataClone))
  }

  // @ts-ignore
  return (
    <div style={containerStyle}>
      <CtimsFormComponentMemo
        ref={formRef}
        onSpecialButtonClick={handleSpecialClick}
        onRjsfFormChange={onFormChange}
      />
      <CtimsMatchDialog
                      onDialogHide={onDialogHideCallback}
                      isDialogVisible={isOpen}
                      armCode={armCode}
                      formData={formData}
      />
    </div>
  );
};

export default Ui;
