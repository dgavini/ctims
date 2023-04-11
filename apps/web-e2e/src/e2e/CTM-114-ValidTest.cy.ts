import {
  getAddCriteriaGroup,
  getAddCriteriaList,
  getAddCriteriaToSameGroup, getAddCriteriaToSameList,
  getAddCriteriaToSubGroup,
  getAgeGroup,
  getArmCode,
  getArmDescription,
  getArmInternalId,
  getCheckBoxArmIsSuspended,
  getCheckBoxCancerCenterIRB,
  getCheckBoxCoordinateCenter,
  getCheckBoxIcon,
  getCheckBoxLevelIsSuspended,
  getCheckBoxPrimaryManagementGroup,
  getCheckBoxPrincipalSponsor,
  getClickPhase,
  getClinicalAge, getClinicalDropdown,
  getClinicalERStatus,
  getClinicalHER2Status,
  getClinicalOncotreePrimaryDiagnosis,
  getClinicalPRStatus, getClinicalTMB, getCNVCall,
  getCtmlStatusDropdown,
  getDefaultTextMatchingCriteria, getDefaultTrialEditorDropDown,
  getDrugName,
  getEditMatchingCriteria,
  getGenomicDropDown,
  getHugoSymbol,
  getLeftMenuComponent,
  getLevelCode,
  getLevelDescription,
  getLevelInternalId,
  getLongTitle,
  getManagementGroupName, getMatchingCriteriaTableHeader, getMatchModalFooterButtons,
  getMenuItemAnd,
  getMenuItemClinical,
  getMenuItemClinicalGenomic,
  getMenuItemOr,
  getNCTPurpose,
  getPhaseDropdownList,
  getPlusIcon,
  getPrincipalInvestigator, getProteinChange,
  getProtocolNumber,
  getProtocolStaffEmail,
  getProtocolStaffFirstName,
  getProtocolStaffInstitutionalName,
  getProtocolStaffLastName,
  getProtocolStaffRole,
  getProtocolStaffStatus, getSaveMatchingCriteria,
  getShortTitle,
  getSiteName,
  getSiteStatus,
  getSponsorName,
  getSwitchGroupOperator,
  getTrialId,
  getTrialNickname,
  getTruncateButton,
  getVariantCategory, getVariantClassification,
  selectDraftCtmlStatus, trialEditorExportCtml, trialEditorHeaderButtons,
  trialEditorLeftPanelList, trialEditorRadioButtons
} from '../support/app.po';
//import {NCT02503722_Osimertinib} from "../fixtures/NCT02503722_Osimertinib";
import {NCT03297606_CAPTUR} from "../fixtures/NCT03297606_CAPTUR"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');
import * as yaml from 'js-yaml';
import {doc} from "prettier";
import breakParent = doc.builders.breakParent;
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

describe('CTIMS Trial Editor', () => {
  before(() => cy.visit('/'));
  deleteDownloadsFolderBeforeAll()
  it('should Validate the Trial Editor Page with valid test data', () => {
    cy.title().should('contain', 'CTIMS')
    trialEditorLeftPanelList().should('have.length', '9')
    cy.trialInformation(NCT03297606_CAPTUR.nct_id,
      "My Trial",
      "John Doe",
      "Draft",
      NCT03297606_CAPTUR.long_title,
      NCT03297606_CAPTUR.short_title,
      NCT03297606_CAPTUR.phase,
      NCT03297606_CAPTUR.protocol_no,
      NCT03297606_CAPTUR.nct_purpose,
      NCT03297606_CAPTUR.status)

    // Prior treatment requirements - Done
    cy.clickMultiple('#array-item-list-root_prior_treatment_requirements>div>.pi-plus-circle',
      NCT03297606_CAPTUR.prior_treatment_requirements.length);
    cy.get('[id^=root_prior_treatment_requirements]').each((input, index) => {
      // check if there is a corresponding value in the array
      if (NCT03297606_CAPTUR.prior_treatment_requirements[index]) {
        // enter the value into the text box
        cy.wrap(input).type(NCT03297606_CAPTUR.prior_treatment_requirements[index]);
      }
    })
    //Age - Done
    cy.age(NCT03297606_CAPTUR.age)

    //Drug List - Done
    cy.clickMultiple('#array-item-list-root_drug_list_drug>div>.pi-plus-circle',
      NCT03297606_CAPTUR.drug_list.drug.length - 1);

    cy.get('[id^=root_drug_list_drug]').each((input, index) => {
      // check if there is a corresponding value in the array
      if (NCT03297606_CAPTUR.drug_list.drug[index]) {
        // enter the value into the text box
        cy.wrap(input).type(NCT03297606_CAPTUR.drug_list.drug[index].drug_name);
      }
    })

    //Management Group List - Done
    cy.clickMultiple('#array-item-list-root_management_group_list_management_group>div>.pi-plus-circle',
      NCT03297606_CAPTUR.management_group_list.management_group.length - 1);
    cy.get('[id^=object-field-template-root_management_group_list_management_group').each(($input, index) => {
      cy.wrap($input).find('.p-dropdown').click().contains(NCT03297606_CAPTUR.management_group_list.management_group[index].management_group_name).click();
      cy.wrap($input).find('.p-selectbutton').contains(NCT03297606_CAPTUR.management_group_list.management_group[index].is_primary).click();
    });

    //Site List - done
    cy.clickMultiple('#array-item-list-root_site_list_site>div>.pi-plus-circle',
      NCT03297606_CAPTUR.site_list.site.length - 1);
    cy.get('[id^=object-field-template-root_site_list_site]').each(($input, index) => {
      cy.wrap($input).find('.p-dropdown').eq(0).click().contains(NCT03297606_CAPTUR.site_list.site[index].site_name).click();
      cy.wrap($input).find('.p-dropdown').eq(1).click().contains(NCT03297606_CAPTUR.site_list.site[index].site_status).click();
      cy.wrap($input).find('.p-selectbutton').eq(0).click().contains(NCT03297606_CAPTUR.site_list.site[index].coordinating_center).click();
      cy.wrap($input).find('.p-selectbutton').eq(1).click().contains(NCT03297606_CAPTUR.site_list.site[index].uses_cancer_center_irb).click();
    });

    //Sponsor List array of 5 values - done
    cy.clickMultiple('#array-item-list-root_sponsor_list_sponsor>div>.pi-plus-circle', NCT03297606_CAPTUR.sponsor_list.sponsor.length - 1)
    cy.get('[id^=object-field-template-root_sponsor_list_sponsor_]').each(($input, index) => {
      cy.wrap($input).find('.p-inputtext').type(NCT03297606_CAPTUR.sponsor_list.sponsor[index].sponsor_name)
      cy.wrap($input).find('.p-selectbutton').contains(NCT03297606_CAPTUR.sponsor_list.sponsor[index].is_principal_sponsor).click();
    });

    //Staff List - Done
    cy.clickMultiple('#array-item-list-root_staff_list_protocol_staff>div>.pi-plus-circle',
      NCT03297606_CAPTUR.staff_list.protocol_staff.length - 1);
    cy.get('[id^=object-field-template-root_staff_list_protocol_staff]').each(($input, index) => {
      cy.log($input.attr('id'));
      cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.staff_list.protocol_staff[index].first_name);
      cy.wrap($input).find('.p-inputtext').eq(1).type(NCT03297606_CAPTUR.staff_list.protocol_staff[index].last_name);
      cy.wrap($input).find('.p-inputtext').eq(2).type(NCT03297606_CAPTUR.staff_list.protocol_staff[index].email_address);
      cy.wrap($input).find('.p-dropdown').eq(0).click().contains(NCT03297606_CAPTUR.staff_list.protocol_staff[index].institution_name).click();
      cy.wrap($input).find('.p-dropdown').eq(1).click().contains(NCT03297606_CAPTUR.staff_list.protocol_staff[index].staff_role).click();
    });
  })
//************ Arm 1  *****************
  it('should Validate the match criteria for Arm 1', () => {
    trialEditorLeftPanelList().eq(8).should('contain', 'Treatment List').click()
    cy.get('#array-item-list-root_treatment_list_step_0_arm>div>div>div>div>div').each(($input, index) => {
      cy.log($input.attr('id'));

      cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_code);
      cy.wrap($input).find('.p-inputtext').eq(1).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_description);
      cy.wrap($input).find('.p-inputtext').eq(2).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_internal_id.toString());
      cy.wrap($input).find('.p-selectbutton').contains(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_suspended).click();
      //cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].dose_level[index].level_code);
    })
    /* NCT03297606_CAPTUR.treatment_list.step[0].arm.forEach((arm,index) => {
       cy.get(`[id^=array-item-list-root_treatment_list_step_0_arm_${index}_dose_level]>div>div`).contains('Add Dose' +
         ' Level').click()
 */
    cy.get(`[id^=array-item-list-root_treatment_list_step_0_arm_0_dose_level]`).each(($input, index) => {
      cy.log($input.attr('id'));
      cy.get('#root_treatment_list_step_0_arm_0_dose_level_' + index + '_level_code').type(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].dose_level[index].level_code);
      cy.get('#root_treatment_list_step_0_arm_0_dose_level_' + index + '_level_description').type(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].dose_level[index].level_description);
      cy.get('#root_treatment_list_step_0_arm_0_dose_level_' + index + '_level_internal_id').type(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].dose_level[index].level_internal_id.toString());
      cy.get('#root_treatment_list_step_0_arm_0_dose_level_' + index + '_level_suspended').contains(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].dose_level[index].level_suspended).click();

      // })
    });
    //click first matching criteria link of Arm 1
    cy.get('.CtimsMatchingCriteriaWidget_edit-matching-criteria-container__MFwrC').eq(0).click()

    getAddCriteriaGroup().click()

    //******** OR ********************
    cy.clickParentAnd()
    cy.clickOr()
    //Click Or Parent at index 1
    cy.clickParentNode(1).click()
    // cy.clickChildOr()
    let orConditions = NCT03297606_CAPTUR.treatment_list.step[0].arm[0].match[0].and[0].or
    cy.log(JSON.stringify(orConditions))
    cy.log(orConditions.length.toString())
    cy.clickGenomic()
    cy.clickChildToggleArrowButton(1)
    // cy.clickParentNode(2).click()
    // getLeftMenuComponent().eq(2).click()
    cy.clickMultipleFunction(getAddCriteriaToSameList(), orConditions.length - 1)
    let subChildren = cy.get('.LeftMenuComponent_matchingCriteriaMenuContainer__fe8dz>div:nth-child(2)>ul>li>ul>li')
    subChildren.find('.p-treenode-children>li')
      .each((childElement, index) => {
        cy.log(index.toString())
        if (Cypress.$(childElement).length > 0) {
          cy.wrap(childElement).click() // click on each child element
          let condition = orConditions[index % orConditions.length]; // get the corresponding and condition
          cy.log(orConditions.length.toString())
          Object.entries(condition.genomic).map(([key, value]) => {
            if (key === 'cnv_call') {
              getCNVCall().type(value)
            }
            if (key === 'hugo_symbol') {
              getHugoSymbol().type(value)
            }
            if (key === 'variant_category') {
              getVariantCategory().click()
              getGenomicDropDown().contains(value).click()
            }
          })
        } else {
          return false;
        }
      })
    // getSaveMatchingCriteria().click()

    //!******** Add clinical at Parent AND ********************
    cy.clickParentNode(0).click()
    //cy.clickAnd()
    cy.clickClinical()
    getClinicalAge().type(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].match[0].and[1].clinical.age_numerical)
    getClinicalOncotreePrimaryDiagnosis().type(NCT03297606_CAPTUR.treatment_list.step[0].arm[0].match[0].and[1].clinical.oncotree_primary_diagnosis)
    getSaveMatchingCriteria().click()
  })
  //************ Arm 7  *****************

  it('should Validate the match criteria for Arm 7', () => {
    cy.get('#array-item-list-root_treatment_list_step_0_arm').contains('Add arm').click()

    cy.get('#object-field-template-root_treatment_list_step_0_arm_1').each(($input, index) => {
      cy.log($input.attr('id'));

      cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_code);
      cy.wrap($input).find('.p-inputtext').eq(1).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_description);
      cy.wrap($input).find('.p-inputtext').eq(2).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_internal_id.toString());
      cy.wrap($input).find('.p-selectbutton').contains(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].arm_suspended).click();
      //cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[index].dose_level[index].level_code);
    })
    /*NCT03297606_CAPTUR.treatment_list.step[0].arm.forEach((arm,index) => {
      cy.get(`[id^=array-item-list-root_treatment_list_step_0_arm_${index}_dose_level]>div>div`).contains('Add Dose' +
        ' Level').click()
    })*/
    cy.get('#array-item-list-root_treatment_list_step_0_arm_1_dose_level').contains('Add Dose Level').click()
    cy.wait(1000)
    cy.get('#object-field-template-root_treatment_list_step_0_arm_1_dose_level_0').each(($input, index) => {
      cy.log($input.attr('id'));
      cy.wrap($input).find('.p-inputtext').eq(0).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[2].dose_level[0].level_code);
      cy.wrap($input).find('.p-inputtext').eq(1).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[2].dose_level[0].level_description);
      cy.wrap($input).find('.p-inputtext').eq(2).type(NCT03297606_CAPTUR.treatment_list.step[0].arm[2].dose_level[0].level_internal_id.toString());
      cy.wrap($input).find('.p-selectbutton').contains(NCT03297606_CAPTUR.treatment_list.step[0].arm[2].dose_level[0].level_suspended).click();
    });
    //cy.pause()
    cy.get('.CtimsMatchingCriteriaWidget_edit-matching-criteria-container__MFwrC').eq(1).click()

    getAddCriteriaGroup().click()

    //******** OR ********************

    cy.clickParentAnd()
    cy.clickOr()
    //Click Or Parent at index 1
    cy.clickParentNode(1).click()
    // cy.clickChildOr()
    let orConditions = NCT03297606_CAPTUR.treatment_list.step[0].arm[2].match[0].and[0].or
    cy.log(JSON.stringify(orConditions))
    cy.log(orConditions.length.toString())
    cy.clickGenomic()
    cy.clickChildToggleArrowButton(1)
    // cy.clickParentNode(2).click()
    // getLeftMenuComponent().eq(2).click()
    cy.clickMultipleFunction(getAddCriteriaToSameList(), orConditions.length - 1)
    let subChildren = cy.get('.LeftMenuComponent_matchingCriteriaMenuContainer__fe8dz>div:nth-child(2)>ul>li>ul>li')
    subChildren.find('.p-treenode-children>li')
      .each((childElement, index) => {
        cy.log(index.toString())
        if (Cypress.$(childElement).length > 0) {
          cy.wrap(childElement).click() // click on each child element
          let condition = orConditions[index % orConditions.length]; // get the corresponding and condition
          cy.log(orConditions.length.toString())
          Object.entries(condition.genomic).map(([key, value]) => {
            if (key === 'hugo_symbol') {
              getHugoSymbol().type(value)
            }
            if (key === 'variant_category') {
              getVariantCategory().click()
              getGenomicDropDown().contains(value).click()
            }
          })
        } else {
          return false;
        }
      })
    //!******** AND ********************
    cy.clickParentNode(0)
    cy.clickAnd()
    cy.clickParentNode(4)
    cy.clickClinical()
    cy.clickChildToggleArrowButton(2)
    // cy.wait(1000)
    let clinicalLength = NCT03297606_CAPTUR.treatment_list.step[0].arm[2].match[0].and[1].and.length - 1
    cy.clickMultipleFunction(getAddCriteriaToSameList(), clinicalLength)

    let andConditions = NCT03297606_CAPTUR.treatment_list.step[0].arm[2].match[0].and[1].and
    subChildren = cy.get('.LeftMenuComponent_matchingCriteriaMenuContainer__fe8dz>div:nth-child(2)>ul>li>ul>li')
    subChildren.contains('And').find('.p-treenode-children>li')
      .each((childElement, index) => {
      cy.log(index.toString())
      if (Cypress.$(childElement).length > 0) {
        cy.wrap(childElement).click() // click on each child element
        let condition = andConditions[index % andConditions.length]; // get the corresponding and condition
        //andConditions.forEach(condition => { // get the corresponding and condition
        cy.log(andConditions.length.toString())
        Object.entries(condition.clinical).map(([key, value]) => {
          if (key === 'age_numerical') {
            getClinicalAge().type(value)
          }
          if (key === 'oncotree_primary_diagnosis') {
            getClinicalOncotreePrimaryDiagnosis().type(value)
          }
          if (key === 'tmb') {
            getClinicalTMB().type(value)
          }
        })
      } else {
        return false;
      }
    })
    getSaveMatchingCriteria().click()
})
    //************Export Ctml***************
      it('should click on the Export button and then Export as "JSON" file ', () => {
        trialEditorHeaderButtons().eq(1).should('contain', 'Export').click()
        trialEditorRadioButtons().eq(0).should('contain.html', 'json')
        cy.get('[type="radio"]').first().check({force: true}).should('be.checked')
        trialEditorExportCtml().eq(1).should('contain', 'Export CTML').click()
      });

      it('should click on the Export button and then Export as "YAML" file ', () => {
        trialEditorRadioButtons().eq(1).click({force: true})
        trialEditorExportCtml().eq(1).should('contain', 'Export CTML').click()
      });

      it('should validate the match between "Export JSON" and "Export YAML" file', () => {
        cy.readFile('/Users/srimathijayasimman/WebstormProjects/CTIMS/ctims/apps/web-e2e/cypress/downloads/ctml-model.json', 'utf-8').then((jsonData) => {
          const json = JSON.stringify(jsonData);
          cy.readFile('/Users/srimathijayasimman/WebstormProjects/CTIMS/ctims/apps/web-e2e/cypress/downloads/ctml-model.yaml', 'utf-8').then((yamlData) => {
            const yamlObject = yaml.load(yamlData);
            const yamlVal = JSON.stringify(yamlObject);
            cy.compareArrays(json.split(','), yamlVal.split(','))
          });
        });
      })


})
