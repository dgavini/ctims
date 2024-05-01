import { useEffect, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import {useDispatch, useSelector} from 'react-redux';
import { selectedTrialGroupId, setIsTrialGroupAdmin } from './../../store/slices/contextSlice';
import {RootState} from "../../store/store";
import {json} from "express";

//import { Tooltip } from 'antd';

import { Tooltip } from 'primereact/tooltip';
import styles from './Trials.module.scss';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export const TrialGroupsDropdown = (props: {
  roles?: string[],
  onTrialGroupSelected: (selectedTrialGroup: { role: string, code: string }) => void,
  initialValue?: string
}) => {

    const [trialGroups, setTrialGroups] = useState<any>([]);
    const [selectedTrialGroup, setSelectedTrialGroup] = useState<any>(null);
    // grab the value from store
    const selectedTrialGroupFromState = useSelector((state: RootState) => state.context.seletedTrialGroupId);
    const selectedTrialGroupIsAdminFromState = useSelector((state: RootState) => state.context.isTrialGroupAdmin);

    const dispatch = useDispatch();

    // sync the dropdown default value to the store value
    useEffect(() => {
      if (selectedTrialGroupFromState) {
        // convert {"name":"groupABC","code":true} to {"name":"groupABC (Admin)","code":"groupABC-admin"}
        // or if {"name":"groupDEF", "code":false} to  {"name":"groupDEF","code":"groupDEF"}
        let groupName = selectedTrialGroupFromState;
        let groupCode = selectedTrialGroupFromState;
        console.log(" Group Name, Group Code", groupName , groupCode );
        if (selectedTrialGroupIsAdminFromState) {
          groupName += ' (Admin)';
          groupCode += '-admin';
        }
        setSelectedTrialGroup({ name: groupName, code: groupCode });
      }
    }, [selectedTrialGroupFromState, selectedTrialGroupIsAdminFromState]);

    useEffect(() => {
      const tg = props.roles.map((role) => {
        let result: {name: string, code: string} = null
        if (role.includes('admin')) {
          const plainRole = role.replace('-admin', '');
          result = {name: plainRole + ' (Admin)', code: role};
          return result;
        }

        return {name: role, code: role};

      });
      setTrialGroups(tg)

    }, [props.roles]);


    useEffect(() => {
      if (trialGroups.length === 1) {
        setSelectedTrialGroup(trialGroups[0]);
        dispatch(selectedTrialGroupId(trialGroups[0].code.replace('-admin', '')));
        dispatch(setIsTrialGroupAdmin(trialGroups[0].code.includes('admin')));
        props.onTrialGroupSelected(trialGroups[0]);
      }
    }, [trialGroups]);
    

    const onTrialGroupSelected = (selectedTrialGroup: {role: string, code: string}) => {
      console.log('selectedTrialGroup', selectedTrialGroup);
      const plainRole = selectedTrialGroup.code.replace('-admin', '');
      dispatch(selectedTrialGroupId(plainRole))
      setSelectedTrialGroup(selectedTrialGroup);
      dispatch(setIsTrialGroupAdmin(selectedTrialGroup.code.includes('admin')));
      props.onTrialGroupSelected(selectedTrialGroup);

    }
//<FontAwesomeIcon icon={faQuestionCircle} className="help-icon" />

const questionMarkStyle = `custom-target-icon ${styles['question-mark']} pi pi-question-circle question-mark-target `;
    return (
        <div style={{ display: 'flex' , alignItems: 'center' }}>
          <Dropdown value={trialGroups.length === 1 ? trialGroups[0] : selectedTrialGroup} onChange={(e) => onTrialGroupSelected(e.value)} options={trialGroups} optionLabel="name"
                placeholder="Select a Trial Group" className="w-full md:w-14rem"  />
                  <Tooltip target=".custom-target-icon" />
                  <i className={questionMarkStyle} data-pr-tooltip="Select a trial group to create a new trial or to view trials in that group."></i>
        </div>
    )
}
export default TrialGroupsDropdown;
