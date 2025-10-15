import * as React from 'react';
// import styles from './SpaForm.module.scss';
import type { ISpaFormProps } from './ISpaFormProps';
import { PrimaryButton,DefaultButton,Dialog,TextField,DialogFooter,Shimmer,FontIcon, ThemeProvider, DatePicker,DayOfWeek  } from 'office-ui-fabric-react/lib';
import spservices  from "../../../services/spService";
import { LoggingService } from '../../../logger/LoggerService';
import {  ListTitles } from '../../../shared/helpers/constant';
import Helper from '../../../shared/helpers';
import { Label } from '@fluentui/react';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
// import {ComboboxComponent} from '../../../shared/controls/CombobocComponent';
import { ClockLoader } from "react-spinners";
require('../../../shared/styles/common.scss');
import { WorkFlowStatus } from '../../../shared/helpers/constant';
import Select from 'react-select';
import {HttpClient,HttpClientResponse,IHttpClientOptions} from '@microsoft/sp-http';

interface ISpaFormState{
  formData:any;
  loading:any;
  updateItemId:any;
  existingItem:any;
  hideMsgDialog:any;
  message:any;
  hideErroDialog:any;
  errorMessage:any;
  showErrorBorder:any;
  disableEdit:any;
  Master_dropdownValue:any;
  currentUser:any;
  filePickerResult:any;
  itemId:any;
  enabledEdit:any;
  AttachmentFiles:any;
  hasEditPermission:any;
  hideApproveRejectDig:any;
  commentRequired:any;
  approveRejectAction:any;
  hasApprovalAccess:any;
  ApprovalComments:any;
  RequesterComments:any;
  SPAApprovers:any;
}

export default class SpaForm extends React.Component<ISpaFormProps,ISpaFormState> {
  private spService: spservices;
  private log:LoggingService;


  public constructor(props:any) {
    super(props);
    this.state={
      currentUser:{},
      filePickerResult:[],
      AttachmentFiles:[],
      formData:{
          "REQUESTER_x0020_NAME":"",
          "TEMPLATE_x0020_TYPE":"",
          "SUPPLIER_x0020_TYPE":"",
          "NEW_x0020_SUPPLIER_x0020_NAME":"",
          "EXISTING_x0020_SUPPLIER_x0020_NA":"",   
          "PRODUCT_x0020_TYPE":"",  
          "NEW_x0020_PRODUCT_x0020_NAME":"",
          "EXISTING_x0020_PRODUCT_x0020_NAM":"", 
          "UOM":"", 
          "QUANTITY":"0",
          "PRICE":"0",
          "VALUES_x0020_IN_x0020_RS":"0",
          "OCN_x0020_NUMBER":"",
          "OCN_x0020_DATE":null,
          "SHIPMENT":"",
          "OCN_x0020_SELLING_x0020_PRICE":"0",
          "MARGIN":"0",
          "MARGIN_x0020_PERCENTAGE":"0",
          "RM_x0020_ARRIVAL_x0020_DATE":null,
          "LEAD_x0020_TIME":"",
          "FINAL_x0020_PRICE":"0",
          "OCN_x0020_RM_x0020_PRICE":"0",
          "LAST_x0020_PURCHASE_x0020_PRICE":"0",
          "LAST_x0020_YEAR_x0020_AVERAGE_x0":"0",
          "SUPPLIER_x0020_NAME1":"",
          "SUPPLIER_x0020_NAME2":"",
          "SUPPLIER_x0020_NAME3":"",
          "SUPPLIER_x0020_PRICE1":"0",
          "SUPPLIER_x0020_PRICE2":"0",
          "SUPPLIER_x0020_PRICE3":"0",
          "EXCHANGE_x0020_RATE":"0",
          "INCO_x0020_TERMS":"",
          "PAYMENT_x0020_TERMS":"",
          "NATURE_x0020_OF_x0020_PURCHASE":"",
          "COMMENTS":"",
          "CURRENCY":"",
          "REFERENCE_x0020_NUMBER":"",
          "CHILLI_x0020_RELATED_x0020_PURCH":"",
          "CUSTOMER_x0020_NAME":"",
          "ENTEY_x0020_LEVEL2_x0020_REQUIRE":"",
          "ENTEY_x0020_LEVEL2_x0020_NAME":""  
      },
      updateItemId:0,
      itemId:0,
      loading:false,
      existingItem:[],
      hideMsgDialog:true,
      message:"",
      hideErroDialog:true,
      errorMessage:"",
      showErrorBorder:false,
      disableEdit:false,
      enabledEdit:false,
      Master_dropdownValue:{},
      hasEditPermission:false,
      hideApproveRejectDig:true,
      commentRequired:false,
      approveRejectAction:"",
      hasApprovalAccess:false,
      ApprovalComments:"",
      RequesterComments:"",
      SPAApprovers:""
    }
    this.spService=new spservices(this.props.context);
    this.log=new LoggingService(this.props.context);
  }

  public async componentDidMount() {
    this.setState({loading:true});
    await this.getMasterData();
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('formid')){
      let itemId=urlParams.get('formid');
      this.setState({updateItemId:itemId});
      await this.getListItem(itemId);
    }else{
      let formData=this.state.formData;
      formData["REQUESTER_x0020_NAME"]= this.state.currentUser.Title;
      this.setState({formData:formData});
    }
     this.setState({loading:false});
  }

  public async getMasterData(){
    try{
      let currentUser=await this.spService.getCurrentUser(); 
      let Master_dropdownValue:any=await this.spService.getChoiceColumnsAndValues(this.props.listName);
      let SPAApprovers:any=await this.spService.getListItem(ListTitles.SPAApprovers,"*","","");
      this.setState({Master_dropdownValue:Master_dropdownValue,currentUser:currentUser,SPAApprovers:SPAApprovers});
      
    }catch(error){
      await this.log.Error({
        WebPartName: 'SpaForm',
        ComponentName: 'SpaForm',
        MethodName: 'getMasterData()',
        Message: 'Exception occurred while fetching response' + error
      });
    }
  }

  public async getListItem(itemId:any){
    try{
      let existingItem:any=await this.spService.getListItem(this.props.listName,"*,AttachmentFiles,Author/Title,Author/EMail,Author/Id","AttachmentFiles,Author",`Id eq ${itemId}`);

      if(existingItem!=null && existingItem.length>0){

      let SelectedEXISTING_x0020_SUPPLIER_x0020_NA =  this.state.Master_dropdownValue["EXISTING SUPPLIER NAME"].filter((c:any)=>c.value == existingItem[0]["EXISTING_x0020_SUPPLIER_x0020_NA"]);
      let SelectedEXISTING_x0020_PRODUCT_x0020_NAM =  this.state.Master_dropdownValue["EXISTING PRODUCT NAME"].filter((c:any)=>c.value == existingItem[0]["EXISTING_x0020_PRODUCT_x0020_NAM"]);
      let SelectedPRODUCT_x0020_TYPE =  this.state.Master_dropdownValue["PRODUCT TYPE"].filter((c:any)=>c.value == existingItem[0]["PRODUCT_x0020_TYPE"]);
      let SelectedUOM =  this.state.Master_dropdownValue["UOM"].filter((c:any)=>c.value == existingItem[0]["UOM"]);
      let SelectedCHILLI_x0020_RELATED_x0020_PURCH =  this.state.Master_dropdownValue["CHILLI RELATED PURCHASE"].filter((c:any)=>c.value == existingItem[0]["CHILLI_x0020_RELATED_x0020_PURCH"]);
      let SelectedENTEY_x0020_LEVEL2_x0020_REQUIRE =  this.state.Master_dropdownValue["ENTEY LEVEL2 REQUIRED"].filter((c:any)=>c.value == existingItem[0]["ENTEY_x0020_LEVEL2_x0020_REQUIRE"]);
      let SelectedTEMPLATE_x0020_TYPE =  this.state.Master_dropdownValue["TEMPLATE TYPE"].filter((c:any)=>c.value == existingItem[0]["TEMPLATE_x0020_TYPE"]);
      let SelectedSUPPLIER_x0020_TYPE =  this.state.Master_dropdownValue["SUPPLIER TYPE"].filter((c:any)=>c.value == existingItem[0]["SUPPLIER_x0020_TYPE"]);
      let SelectedCURRENCY  =  this.state.Master_dropdownValue["CURRENCY"].filter((c:any)=>c.value == existingItem[0]["CURRENCY"]);
      let SelectedINCO_x0020_TERMS  =  this.state.Master_dropdownValue["INCO TERMS"].filter((c:any)=>c.value == existingItem[0]["INCO_x0020_TERMS"]);
      let SelectedPAYMENT_x0020_TERMS  =  this.state.Master_dropdownValue["PAYMENT TERMS"].filter((c:any)=>c.value == existingItem[0]["PAYMENT_x0020_TERMS"]);
      let SelectedNATURE_x0020_OF_x0020_PURCHASE  =  this.state.Master_dropdownValue["NATURE OF PURCHASE"].filter((c:any)=>c.value == existingItem[0]["NATURE_x0020_OF_x0020_PURCHASE"]);
 
      
      this.setState({formData:{
          "REQUESTER_x0020_NAME":existingItem[0]["REQUESTER_x0020_NAME"],
          "TEMPLATE_x0020_TYPE":SelectedTEMPLATE_x0020_TYPE,
          "SUPPLIER_x0020_TYPE":SelectedSUPPLIER_x0020_TYPE,
          "NEW_x0020_SUPPLIER_x0020_NAME":existingItem[0]["NEW_x0020_SUPPLIER_x0020_NAME"],
          "EXISTING_x0020_SUPPLIER_x0020_NA":SelectedEXISTING_x0020_SUPPLIER_x0020_NA,   
          "PRODUCT_x0020_TYPE":SelectedPRODUCT_x0020_TYPE,  
          "NEW_x0020_PRODUCT_x0020_NAME":existingItem[0]["NEW_x0020_PRODUCT_x0020_NAME"],
          "EXISTING_x0020_PRODUCT_x0020_NAM":SelectedEXISTING_x0020_PRODUCT_x0020_NAM, 
          "UOM":SelectedUOM, 
          "QUANTITY":existingItem[0]["QUANTITY"],
          "PRICE":existingItem[0]["PRICE"],
          "VALUES_x0020_IN_x0020_RS":existingItem[0]["VALUES_x0020_IN_x0020_RS"],
          "OCN_x0020_NUMBER":existingItem[0]["OCN_x0020_NUMBER"],
          "OCN_x0020_DATE":existingItem[0]["OCN_x0020_DATE"]!=null?new Date(existingItem[0]["OCN_x0020_DATE"]):null,
          "SHIPMENT":existingItem[0]["SHIPMENT"],
          "OCN_x0020_SELLING_x0020_PRICE":existingItem[0]["OCN_x0020_SELLING_x0020_PRICE"],
          "MARGIN":existingItem[0]["MARGIN"],
          "MARGIN_x0020_PERCENTAGE":existingItem[0]["MARGIN_x0020_PERCENTAGE"],
          "RM_x0020_ARRIVAL_x0020_DATE":existingItem[0]["RM_x0020_ARRIVAL_x0020_DATE"]!=null ?new Date(existingItem[0]["RM_x0020_ARRIVAL_x0020_DATE"]):null,
          "LEAD_x0020_TIME":existingItem[0]["LEAD_x0020_TIME"],
          "FINAL_x0020_PRICE":existingItem[0]["FINAL_x0020_PRICE"],
          "OCN_x0020_RM_x0020_PRICE":existingItem[0]["OCN_x0020_RM_x0020_PRICE"],
          "LAST_x0020_PURCHASE_x0020_PRICE":existingItem[0]["LAST_x0020_PURCHASE_x0020_PRICE"],
          "LAST_x0020_YEAR_x0020_AVERAGE_x0":existingItem[0]["LAST_x0020_YEAR_x0020_AVERAGE_x0"],
          "SUPPLIER_x0020_NAME1":existingItem[0]["SUPPLIER_x0020_NAME1"],
          "SUPPLIER_x0020_NAME2":existingItem[0]["SUPPLIER_x0020_NAME2"],
          "SUPPLIER_x0020_NAME3":existingItem[0]["SUPPLIER_x0020_NAME3"],
          "SUPPLIER_x0020_PRICE1":existingItem[0]["SUPPLIER_x0020_PRICE1"],
          "SUPPLIER_x0020_PRICE2":existingItem[0]["SUPPLIER_x0020_PRICE2"],
          "SUPPLIER_x0020_PRICE3":existingItem[0]["SUPPLIER_x0020_PRICE3"],
          "EXCHANGE_x0020_RATE":existingItem[0]["EXCHANGE_x0020_RATE"],
          "INCO_x0020_TERMS":SelectedINCO_x0020_TERMS,
          "PAYMENT_x0020_TERMS":SelectedPAYMENT_x0020_TERMS,
          "NATURE_x0020_OF_x0020_PURCHASE":SelectedNATURE_x0020_OF_x0020_PURCHASE,
          "COMMENTS":existingItem[0]["COMMENTS"],
          "CURRENCY":SelectedCURRENCY,
          "REFERENCE_x0020_NUMBER":existingItem[0]["REFERENCE_x0020_NUMBER"],
          "CHILLI_x0020_RELATED_x0020_PURCH":SelectedCHILLI_x0020_RELATED_x0020_PURCH, 
          "CUSTOMER_x0020_NAME":existingItem[0]["CUSTOMER_x0020_NAME"],
          "ENTEY_x0020_LEVEL2_x0020_REQUIRE":SelectedENTEY_x0020_LEVEL2_x0020_REQUIRE,
          "ENTEY_x0020_LEVEL2_x0020_NAME":existingItem[0]["ENTEY_x0020_LEVEL2_x0020_NAME"],
      },existingItem:existingItem,disableEdit:true});

      switch(existingItem[0].APPROVAL_x0020_STATUS){
        case WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2 : 
            if(this.state.currentUser.Email.toLowerCase() == existingItem[0].ENTEY_x0020_LEVEL2_x0020_EMAIL.toLowerCase()) this.setState({hasApprovalAccess:true});
        break;

        case WorkFlowStatus.WAITINGFORPROCUREMENTLEADAPPROVAL : 
            if(this.state.currentUser.Email.toLowerCase() == existingItem[0].APPROVER_x0020_LEVEL1_x0020_EMAI.toLowerCase()) this.setState({hasApprovalAccess:true});
        break;

        case WorkFlowStatus.WAITINGFORAPPROVAL1 : 
            if(this.state.currentUser.Email.toLowerCase() == existingItem[0].APPROVER_x0020_LEVEL1_x0020_EMAI.toLowerCase()) this.setState({hasApprovalAccess:true});
        break;

        case WorkFlowStatus.WAITINGFORAPPROVAL2:
          if(this.state.currentUser.Email.toLowerCase() == existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI.toLowerCase()) this.setState({hasApprovalAccess:true});
        break;

        case WorkFlowStatus.WAITINGFORAPPROVAL3:
          if(this.state.currentUser.Email.toLowerCase() == existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI.toLowerCase()) this.setState({hasApprovalAccess:true});
        break; 
      }


      if(existingItem[0]["APPROVAL_x0020_STATUS"].toLowerCase().indexOf("reject") !=-1 && existingItem[0].Author.Id == this.state.currentUser.Id){
        this.setState({hasEditPermission:true});
      }
     
    }
    }catch(error){
      await this.log.Error({
        WebPartName: 'SpaForm',
        ComponentName: 'SpaForm',
        MethodName: 'getListItem',
        Message: 'Exception occurred while fetching response' + error
      });
    }
  }

  public onTextBoxChangeEvent(field:any,ev:any){
    let formData=this.state.formData;

    if(field=="ApprovalComments"){
      this.setState({ApprovalComments:ev.target.value});
    }else  if(field=="RequesterComments"){
      this.setState({RequesterComments:ev.target.value});
    }else  if(field=="PRICE" || field=="QUANTITY"||field=="EXCHANGE_x0020_RATE"){
      formData[field]= ev.target.value;
      this.setState({formData:formData},this.calculateValueinRs);
    }else  if(field=="OCN_x0020_SELLING_x0020_PRICE" || field=="MARGIN_x0020_PERCENTAGE"){
      formData[field]= ev.target.value;
      this.setState({formData:formData},this.calculateMargin);
    }else{
      formData[field]= ev.target.value;
      this.setState({formData:formData});
    }
  }

  public calculateValueinRs(){
    let formData=this.state.formData;
    if(formData["PRICE"] != "" &&  formData["QUANTITY"] != "" && formData["EXCHANGE_x0020_RATE"] != "" ){
      formData["VALUES_x0020_IN_x0020_RS"]= parseFloat(this.state.formData.PRICE) *parseFloat(this.state.formData.QUANTITY) * parseFloat(this.state.formData.EXCHANGE_x0020_RATE) 
    }
    this.setState({formData:formData});
  }

  public calculateMargin(){
    let formData=this.state.formData;
    if(formData["OCN_x0020_SELLING_x0020_PRICE"] != "" &&  formData["MARGIN_x0020_PERCENTAGE"] != ""  ){
      formData["MARGIN"]= (parseFloat(this.state.formData.OCN_x0020_SELLING_x0020_PRICE) *parseFloat(this.state.formData.MARGIN_x0020_PERCENTAGE)) / 100; 
    }
    this.setState({formData:formData});
  }

  public async onDropdownChangeEvent(field:any,ev:any,selectedOpt:any){
    let formData=this.state.formData;
    formData[field]=ev.value;

    if(field=="ENTEY_x0020_LEVEL2_x0020_REQUIRE"){
      if(ev.value == "YES"){
        let approver:any= this.state.SPAApprovers.filter((x:any)=>x.Title == "ENTEY LEVEL2");
        if(approver!=null && approver.length>0){
          formData["ENTEY_x0020_LEVEL2_x0020_NAME"]=approver[0]["Approver1Name"];
          formData["ENTEY_x0020_LEVEL2_x0020_EMAIL"]=approver[0]["Approver1Email"];
        }
      }else{
        formData["ENTEY_x0020_LEVEL2_x0020_NAME"]="";
        formData["ENTEY_x0020_LEVEL2_x0020_EMAIL"]="";
      }
    }
    this.setState({formData:formData});
  }
  
  public onCheckboxChangeEvent(field:any,ev:any,selectedOpt:any){
    let formData=this.state.formData;
    formData[field]=selectedOpt;
    this.setState({formData:formData});
  }

  public onDateChange(field:any,date: any){
    let formData=this.state.formData;
    formData[field]=new Date(date);
    this.setState({formData:formData});
  }

  public async onSave(){
    let result:any;
    let {errorcontrol}=this.validateForm();
    if(errorcontrol=="")
    {
      this.setState({loading:true});
      let formData:any=this.state.formData;

      let itemId:any=0;
      let nextApproverName:any="",to:any="";
      
      //if(this.state.updateItemId==0){
        await this.getWorkflowAction(formData);
        if(formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE=="YES"){
          nextApproverName=formData["ENTEY_x0020_LEVEL2_x0020_NAME"];
          to=formData["ENTEY_x0020_LEVEL2_x0020_EMAIL"]
        }else{
          nextApproverName=formData.APPROVER_x0020_LEVEL2_x0020_NAME;
          to=formData.APPROVER_x0020_LEVEL1_x0020_EMAI;
        }

      if(this.state.updateItemId==0){
        result= await this.spService.saveListItem(this.props.listName,formData);
        if(result){
          itemId=result.Id;

          let cc:any="";
          if(formData.Notification1 !="" && formData.Notification1 !=null) cc+=formData.Notification1+";";
          if(formData.Notification2 !="" && formData.Notification2 !=null) cc+=formData.Notification2+";";
          if(formData.Notification3 !="" && formData.Notification3 !=null) cc+=formData.Notification3+";";
          await this.sendEmail(to,cc, formData.APPROVAL_x0020_STATUS,this.state.currentUser.Title,result.Id,nextApproverName);
          this.setState({itemId:result.Id});
        } 
      }
      else{

        if(typeof formData.EXISTING_x0020_SUPPLIER_x0020_NA == "object") formData.EXISTING_x0020_SUPPLIER_x0020_NA=formData.EXISTING_x0020_SUPPLIER_x0020_NA.length>0?formData.EXISTING_x0020_SUPPLIER_x0020_NA[0].value:"";
        if(typeof formData.EXISTING_x0020_PRODUCT_x0020_NAM == "object") formData.EXISTING_x0020_PRODUCT_x0020_NAM=formData.EXISTING_x0020_PRODUCT_x0020_NAM.length>0 ?formData.EXISTING_x0020_PRODUCT_x0020_NAM[0].value:"";
        if(typeof formData.PRODUCT_x0020_TYPE == "object") formData.PRODUCT_x0020_TYPE=formData.PRODUCT_x0020_TYPE.length>0 ?formData.PRODUCT_x0020_TYPE[0].value:"";
        if(typeof formData.UOM == "object") formData.UOM=formData.UOM.length>0 ? formData.UOM[0].value:"";
        if(typeof formData.CHILLI_x0020_RELATED_x0020_PURCH == "object") formData.CHILLI_x0020_RELATED_x0020_PURCH=formData.CHILLI_x0020_RELATED_x0020_PURCH.length>0 ? formData.CHILLI_x0020_RELATED_x0020_PURCH[0].value:"";
        if(typeof formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE == "object") formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE=formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE.length>0 ? formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE[0].value:"";
        if(typeof formData.TEMPLATE_x0020_TYPE == "object") formData.TEMPLATE_x0020_TYPE=formData.TEMPLATE_x0020_TYPE.length>0 ? formData.TEMPLATE_x0020_TYPE[0].value:"";
        if(typeof formData.SUPPLIER_x0020_TYPE == "object") formData.SUPPLIER_x0020_TYPE=formData.SUPPLIER_x0020_TYPE.length>0 ? formData.SUPPLIER_x0020_TYPE[0].value:"";
        if(typeof formData.CURRENCY == "object") formData.CURRENCY=formData.CURRENCY.length>0 ? formData.CURRENCY[0].value:"";
        if(typeof formData.INCO_x0020_TERMS == "object") formData.INCO_x0020_TERMS=formData.INCO_x0020_TERMS.length>0 ? formData.INCO_x0020_TERMS[0].value:"";
        if(typeof formData.PAYMENT_x0020_TERMS == "object") formData.PAYMENT_x0020_TERMS=formData.PAYMENT_x0020_TERMS.length>0 ? formData.PAYMENT_x0020_TERMS[0].value:"";
        if(typeof formData.NATURE_x0020_OF_x0020_PURCHASE == "object") formData.NATURE_x0020_OF_x0020_PURCHASE=formData.NATURE_x0020_OF_x0020_PURCHASE.length>0 ? formData.NATURE_x0020_OF_x0020_PURCHASE[0].value:"";

        if(this.state.RequesterComments!=""){
          let requestCommentObj:any=[];

          if( this.state.existingItem[0].RequesterComments!=null &&  this.state.existingItem[0].RequesterComments!="")
            requestCommentObj=JSON.parse(this.state.existingItem[0].RequesterComments);

          requestCommentObj.push({comments:this.state.RequesterComments,date:Helper.formatDate(new Date()),status:this.state.existingItem[0]["APPROVAL_x0020_STATUS"]});
          formData["RequesterComments"]=JSON.stringify(requestCommentObj);
        }

        itemId=this.state.updateItemId;
        result=await this.spService.updateListItem(this.props.listName,formData,this.state.updateItemId);

        let cc:any="";
        if(this.state.existingItem[0].Notification1 !="" && this.state.existingItem[0].Notification1 !=null) cc+=this.state.existingItem[0].Notification1+";";
        if(this.state.existingItem[0].Notification2 !="" && this.state.existingItem[0].Notification2 !=null) cc+=this.state.existingItem[0].Notification2+";";
        if(this.state.existingItem[0].Notification3 !="" && this.state.existingItem[0].Notification3 !=null) cc+=this.state.existingItem[0].Notification3+";";

        await this.sendEmail(to,cc, formData.APPROVAL_x0020_STATUS,"",this.state.updateItemId,nextApproverName);
      }

      if(result){

      let filePickerResult:any=this.state.filePickerResult;
      if (filePickerResult && filePickerResult.length > 0) {
        for (let i = 0; i < filePickerResult.length; i++) {
          const item = filePickerResult[i];
          let fileResultContent = await item.downloadFileContent();
          await this.spService.addAttachmentListItem(this.props.listName,itemId,item.fileName,fileResultContent);
        }
      }

        if(this.state.updateItemId==0)
          this.setState({hideMsgDialog:false,message:"SPA Details has been added successfully."});
        else
          this.setState({hideMsgDialog:false,message:"SPA Details has been updated successfully."});
      }
      this.setState({loading:false});
    }else{
        this.setState({hideErroDialog:false,errorMessage:errorcontrol,showErrorBorder:true });
    }
  }

  public async onEntryLevel2Save(){
    let errorcontrol:any="";
    if(this.state.formData.OCN_x0020_SELLING_x0020_PRICE== null || this.state.formData.OCN_x0020_SELLING_x0020_PRICE== "") errorcontrol+="OCN SELLING PRICE,";
    if(this.state.formData.MARGIN== null || this.state.formData.MARGIN== "") errorcontrol+="MARGIN,";
    if(this.state.formData.MARGIN_x0020_PERCENTAGE== null || this.state.formData.MARGIN_x0020_PERCENTAGE== "") errorcontrol+="MARGIN PERCENTAGE,";
     
    if(errorcontrol=="")
    {
      let tempformData:any={};
      tempformData["OCN_x0020_SELLING_x0020_PRICE"]=""+this.state.formData["OCN_x0020_SELLING_x0020_PRICE"];
      tempformData["MARGIN"]=""+this.state.formData["MARGIN"];
      tempformData["MARGIN_x0020_PERCENTAGE"]=""+this.state.formData["MARGIN_x0020_PERCENTAGE"];
      await this.spService.updateListItem(this.props.listName,tempformData ,this.state.updateItemId);
      this.setState({approveRejectAction:"Approved"},this.onApproveReject);
    }else{
        this.setState({hideErroDialog:false,errorMessage:errorcontrol,showErrorBorder:true });
    }
  }

  public async getWorkflowAction(formData:any){
    let SPAApprovers:any=await this.spService.getListItem(ListTitles.SPAApprovers,"*","","");
    let condition:any="";

    if(this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH == "YES"){
      condition="Chilli Related Purchase";
      formData.APPROVAL_x0020_STATUS= WorkFlowStatus.WAITINGFORPROCUREMENTLEADAPPROVAL;
    }else{
      formData.APPROVAL_x0020_STATUS= WorkFlowStatus.WAITINGFORAPPROVAL1;
      if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)<=1000000) condition="≤ 10,00,000"; 
      else if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>1000000 && parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)<=4000000) condition="> 10,00,000 and ≤ 40,00,000";
      else if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>4000000 && parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)<=16000000) condition="> 40,00,000 and ≤ 1.6 Crore";
      else if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>16000000 && parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)<=40000000) condition="> 1.6 Crore and ≤ 4 Crore";
      else if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>40000000 && parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)<=80000000) condition="> 40,00,000 and ≤ 1.6 Crore";
      else if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>80000000 ) condition="8 Crore";
    }

    if(formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE =="YES")
      formData.APPROVAL_x0020_STATUS= WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2;

    let approvers:any=SPAApprovers.filter((x:any)=>x.Title == condition);
      if(approvers!=null && approvers.length>0){
        formData["APPROVER_x0020_LEVEL1_x0020_NAME"]=approvers[0]["Approver1Name"];
        formData["APPROVER_x0020_LEVEL1_x0020_EMAI"]=approvers[0]["Approver1Email"];
        formData["APPROVER_x0020_LEVEL2_x0020_NAME"]=approvers[0]["Approver2Name"];
        formData["APPROVER_x0020_LEVEL2_x0020_EMAI"]=approvers[0]["Approver2Email"];
        formData["APPROVER_x0020_LEVEL3_x0020_NAME"]=approvers[0]["Approver3Name"];
        formData["APPROVER_x0020_LEVEL3_x0020_EMAI"]=approvers[0]["Approver3Email"];
        formData["Notification1"]=approvers[0]["Notification1"];
        formData["Notification2"]=approvers[0]["Notification2"];
        formData["Notification3"]=approvers[0]["Notification3"]; 
      }
  }

  public onDeleteAttachment(item:any){
    let fileAttachment=this.state.filePickerResult;
    let index=fileAttachment.findIndex((x:any)=>x.fileName == item.fileName);
    if (index > -1){
      fileAttachment.splice(index, 1);  
      this.setState({filePickerResult:fileAttachment});
    } 
  }

  public validateForm(){
    let errorcontrol:any="" ;
    if(this.state.formData.TEMPLATE_x0020_TYPE== null || this.state.formData.TEMPLATE_x0020_TYPE== "") errorcontrol+="TEMPLATE_ TYPE,";
    if(this.state.formData.SUPPLIER_x0020_TYPE== null || this.state.formData.SUPPLIER_x0020_TYPE== "") errorcontrol+="SUPPLIER TYPE,";
    if(this.state.formData.SUPPLIER_x0020_TYPE== "NEW" &&  this.state.formData.NEW_x0020_SUPPLIER_x0020_NAME== "") errorcontrol+="NEW SUPPLIER NAME,";
    if(this.state.formData.SUPPLIER_x0020_TYPE== "EXIST" &&   this.state.formData.EXISTING_x0020_SUPPLIER_x0020_NA== "") errorcontrol+="EXISTING SUPPLIER NAME,";
    if(this.state.formData.PRODUCT_x0020_TYPE== null || this.state.formData.PRODUCT_x0020_TYPE== "") errorcontrol+="PRODUCT TYPE,";
    if(this.state.formData.PRODUCT_x0020_TYPE== "NEW"  && this.state.formData.NEW_x0020_PRODUCT_x0020_NAME== "") errorcontrol+="NEW PRODUCT NAME,";
    if(this.state.formData.PRODUCT_x0020_TYPE== "EXIST"  && this.state.formData.EXISTING_x0020_PRODUCT_x0020_NAM== "") errorcontrol+="EXISTING PRODUCT NAME,";
    if(this.state.formData.UOM== null || this.state.formData.UOM== "") errorcontrol+="UOM,";
    if(this.state.formData.QUANTITY== null || this.state.formData.QUANTITY== "") errorcontrol+="QUANTITY,";
    if(this.state.formData.PRICE== null || this.state.formData.PRICE== "") errorcontrol+="PRICE,";
    if(this.state.formData.VALUES_x0020_IN_x0020_RS== null || this.state.formData.VALUES_x0020_IN_x0020_RS== "") errorcontrol+="VALUES IN RS,";
    if(this.state.formData.OCN_x0020_NUMBER== null || this.state.formData.OCN_x0020_NUMBER== "") errorcontrol+="OCN NUMBER,";
    if(this.state.formData.OCN_x0020_DATE== null || this.state.formData.OCN_x0020_DATE== "") errorcontrol+="OCN DATE,";
    if(this.state.formData.SHIPMENT== null || this.state.formData.SHIPMENT== "") errorcontrol+="SHIPMENT,";
    if(this.state.formData.RM_x0020_ARRIVAL_x0020_DATE== null || this.state.formData.RM_x0020_ARRIVAL_x0020_DATE== "") errorcontrol+="RM ARRIVAL DATE,";
    if(this.state.formData.LEAD_x0020_TIME== null || this.state.formData.LEAD_x0020_TIME== "") errorcontrol+="LEAD TIME,";
    if(this.state.formData.FINAL_x0020_PRICE== null || this.state.formData.FINAL_x0020_PRICE== "") errorcontrol+="FINAL PRICE,";
    if(this.state.formData.OCN_x0020_RM_x0020_PRICE== null || this.state.formData.OCN_x0020_RM_x0020_PRICE== "") errorcontrol+="OCN RM PRICE,";
    if(this.state.formData.LAST_x0020_PURCHASE_x0020_PRICE== null || this.state.formData.LAST_x0020_PURCHASE_x0020_PRICE== "") errorcontrol+="LAST PURCHASE PRICE,";
    if(this.state.formData.LAST_x0020_YEAR_x0020_AVERAGE_x0== null || this.state.formData.LAST_x0020_YEAR_x0020_AVERAGE_x0== "") errorcontrol+="LAST YEAR AVERAGE PRICE,";
    if(this.state.formData.SUPPLIER_x0020_NAME1== null || this.state.formData.SUPPLIER_x0020_NAME1== "") errorcontrol+="SUPPLIER NAME1,";
    if(this.state.formData.SUPPLIER_x0020_NAME2== null || this.state.formData.SUPPLIER_x0020_NAME2== "") errorcontrol+="SUPPLIER NAME2,";
    if(this.state.formData.SUPPLIER_x0020_NAME3== null || this.state.formData.SUPPLIER_x0020_NAME3== "") errorcontrol+="SUPPLIER NAME3,";
    if(this.state.formData.SUPPLIER_x0020_PRICE1== null || this.state.formData.SUPPLIER_x0020_PRICE1== "") errorcontrol+="SUPPLIER PRICE1,";
    if(this.state.formData.SUPPLIER_x0020_PRICE2== null || this.state.formData.SUPPLIER_x0020_PRICE2== "") errorcontrol+="SUPPLIER PRICE2,";
    if(this.state.formData.SUPPLIER_x0020_PRICE3== null || this.state.formData.SUPPLIER_x0020_PRICE3== "") errorcontrol+="SUPPLIER PRICE3,";
    if(this.state.formData.EXCHANGE_x0020_RATE== null || this.state.formData.EXCHANGE_x0020_RATE== "") errorcontrol+="EXCHANGE RATE,";
    if(this.state.formData.INCO_x0020_TERMS== null || this.state.formData.INCO_x0020_TERMS== "") errorcontrol+="INCO TERMS,";
    if(this.state.formData.PAYMENT_x0020_TERMS== null || this.state.formData.PAYMENT_x0020_TERMS== "") errorcontrol+="PAYMENT TERMS,";
    if(this.state.formData.NATURE_x0020_OF_x0020_PURCHASE== null || this.state.formData.NATURE_x0020_OF_x0020_PURCHASE== "") errorcontrol+="NATURE OF PURCHASE,";
    if(this.state.formData.CURRENCY== null || this.state.formData.CURRENCY== "") errorcontrol+="CURRENCY,";
    if(this.state.formData.REFERENCE_x0020_NUMBER== null || this.state.formData.REFERENCE_x0020_NUMBER== "") errorcontrol+="REFERENCE NUMBER,";
    if(this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH== null || this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH== "") errorcontrol+="CHILLI RELATED PURCHSE,";
    if(this.state.formData.TEMPLATE_x0020_TYPE=="RM TEMPLATE" && this.state.formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE =="") errorcontrol+="ENTEY LEVEL2 REQUIRED";

    if(parseFloat(this.state.formData.VALUES_x0020_IN_x0020_RS)>80000000 ){
       if (this.state.filePickerResult ==null || this.state.filePickerResult.length == 0) errorcontrol+="ABF pre-approval email attachment required.";
    }

    if(this.state.existingItem.length>0 && this.state.existingItem[0]["APPROVAL_x0020_STATUS"].toLowerCase().indexOf("reject")!=-1){
      if(this.state.RequesterComments==""){
        errorcontrol+="Requester Comments";
      }
    }
    
    return {errorcontrol };
  }

  public async onApproveRejectClick(action:any){
    this.setState({hideApproveRejectDig:false,approveRejectAction:action})
  }
 
  public async onApproveReject(){
    if(this.state.updateItemId!=0){
      if((this.state.approveRejectAction == "Reject" && (this.state.ApprovalComments!=null && this.state.ApprovalComments!="")) || this.state.approveRejectAction == "Approved"){
        this.setState({loading:true,hideApproveRejectDig:true});

        let formData:any={},to:any="",nextApproverName:any="";
   
        switch(this.state.existingItem[0].APPROVAL_x0020_STATUS){
          case WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2 :{
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.WAITINGFORAPPROVAL1;
              to=this.state.existingItem[0].APPROVER_x0020_LEVEL1_x0020_EMAI;
              nextApproverName=this.state.existingItem[0].APPROVER_x0020_LEVEL1_x0020_NAME;
              formData.APPROVER1_x0020_COMMENTS=this.state.ApprovalComments;
          }
          break; 

          case WorkFlowStatus.WAITINGFORPROCUREMENTLEADAPPROVAL:{
            if(this.state.approveRejectAction =="Reject"){
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.PLREJECTED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.PL_x0020_REASON_x0020_FOR_x0020_=this.state.ApprovalComments;
            } else {
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.PL_x0020_COMMENTS=this.state.ApprovalComments;
            }
          }
          break;

          case WorkFlowStatus.WAITINGFORAPPROVAL1:{
            if(this.state.approveRejectAction =="Reject"){
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.APPROVER1REJECTED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.APPROVER1_x0020_REASON_x0020_FOR=this.state.ApprovalComments;
            } else {
              if(this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI!="" && this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI!=null){
                formData.APPROVAL_x0020_STATUS=WorkFlowStatus.WAITINGFORAPPROVAL2;
                to=this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI;
                nextApproverName=this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_NAME;
                formData.APPROVER1_x0020_COMMENTS=this.state.ApprovalComments;
              }else{
                formData.APPROVAL_x0020_STATUS=WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED;
                to=this.state.existingItem[0].Author.EMail;
                nextApproverName=this.state.existingItem[0].Author.Title;
                formData.APPROVER1_x0020_COMMENTS=this.state.ApprovalComments;
              }
              
            }
          }
          break;

          case WorkFlowStatus.WAITINGFORAPPROVAL2:{
            if(this.state.approveRejectAction =="Reject"){
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.APPROVER2REJECTED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.APPROVER2_x0020_REASON_x0020_FOR=this.state.ApprovalComments;
            } else {
              if(this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI!="" && this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI!=null){
                formData.APPROVAL_x0020_STATUS=WorkFlowStatus.WAITINGFORAPPROVAL3;
                to=this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI;
                nextApproverName=this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_NAME;
                formData.APPROVER2_x0020_COMMENTS=this.state.ApprovalComments;
              }else{
                formData.APPROVAL_x0020_STATUS=WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED;
                to=this.state.existingItem[0].Author.EMail;
                nextApproverName=this.state.existingItem[0].Author.Title;
                formData.APPROVER2_x0020_COMMENTS=this.state.ApprovalComments;
              }
              
            }
          }
          break;

          case WorkFlowStatus.WAITINGFORAPPROVAL3:{
            if(this.state.approveRejectAction =="Reject"){
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.APPROVER3REJECTED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.APPROVER3_x0020_REASON_x0020_FOR=this.state.ApprovalComments;
            } else {
              formData.APPROVAL_x0020_STATUS=WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED;
              to=this.state.existingItem[0].Author.EMail;
              nextApproverName=this.state.existingItem[0].Author.Title;
              formData.APPROVER3_x0020_COMMENTS=this.state.ApprovalComments;
            }
          }
          break;

           }
        
        await this.spService.updateListItem(this.props.listName,formData,this.state.updateItemId);

        let filePickerResult:any=this.state.filePickerResult;
        if (filePickerResult && filePickerResult.length > 0) {
          for (let i = 0; i < filePickerResult.length; i++) {
            const item = filePickerResult[i];
            let fileResultContent = await item.downloadFileContent();
            await this.spService.addAttachmentListItem(this.props.listName,this.state.updateItemId,item.fileName,fileResultContent);
          }
        }

        let cc:any="";
        if(this.state.existingItem[0].Notification1 !="" && this.state.existingItem[0].Notification1 !=null) cc+=this.state.existingItem[0].Notification1+";";
        if(this.state.existingItem[0].Notification2 !="" && this.state.existingItem[0].Notification2 !=null) cc+=this.state.existingItem[0].Notification2+";";
        if(this.state.existingItem[0].Notification3 !="" && this.state.existingItem[0].Notification3 !=null) cc+=this.state.existingItem[0].Notification3+";";

        await this.sendEmail(to,cc, formData.APPROVAL_x0020_STATUS,"",this.state.updateItemId,nextApproverName);

        if(this.state.approveRejectAction == "Reject"){
          this.setState({loading:false,hideApproveRejectDig:true,hideMsgDialog:false,message:`SPA Details Form has been rejected successfully`});
        }else {  
          this.setState({loading:false,hideApproveRejectDig:true,hideMsgDialog:false,message:`SPA Details has been approved successfully`});
        }  

      }else{
        this.setState({commentRequired:true})
      }
    }
  }  

  public async sendEmail(to:any,cc:any,status:any,createdBy:any,id:any,nextApproverName:any){
    let emailBody:any="",subject:any="",subjectMaster:any="";
    let createdByUser=createdBy!=""?createdBy:this.state.existingItem[0].Author.Title;
    
    let EmailTemplate:any=await this.spService.getListItem(ListTitles.EmailTemplate,"","","");
    let emailTemplate:any=[];
    
    if(status == WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED)
      emailTemplate=EmailTemplate.filter((x:any)=>x.Title == "Approved"); 
    else if(this.state.approveRejectAction=="Reject")
        emailTemplate=EmailTemplate.filter((x:any)=>x.Title == "Rejected"); 
    else
        emailTemplate=EmailTemplate.filter((x:any)=>x.Title == "Approval"); 
    
    if(emailTemplate.length>0){
      subject=this.replacePlaceholders(emailTemplate[0].Subject,createdByUser,id,nextApproverName,subjectMaster) ;
      emailBody=this.replacePlaceholders(emailTemplate[0].Body,createdByUser,id,nextApproverName,subjectMaster) ;
    }
     
    let FlowUrls:any=await this.spService.getListItem(ListTitles.FlowUrls,"","","Title eq 'SendEmail'");
    if(FlowUrls.length>0){

      const requestHeader:Headers=new Headers();
      requestHeader.append('Content-type','application/json');
      const httpClientOptions:IHttpClientOptions={
        body:JSON.stringify({
              "to":to,
              "cc":cc,
              "subject":subject,
              "body":emailBody
            }),
        headers:requestHeader
      };

      await this.props.context.httpClient.post(FlowUrls[0].Url,HttpClient.configurations.v1,httpClientOptions).then((response:HttpClientResponse)=>{
        console.log(response);
      });

      let sendAuthor:any=true;
      if(this.state.approveRejectAction =="Reject") { sendAuthor=false; }  
      if(this.state.existingItem.length>0 && this.state.formData.APPROVAL_x0020_STATUS ==  WorkFlowStatus.PROCUREMENTAPPROVALCOMPLETED){ sendAuthor=false;  }

      if(sendAuthor){
        let AuthorCopy_emailTemplate=EmailTemplate.filter((x:any)=>x.Title == "AuthorCopy"); 
        if(emailTemplate.length>0){
          let AuthorCopy_subject=this.replacePlaceholders(AuthorCopy_emailTemplate[0].Subject,createdByUser,id,nextApproverName,subjectMaster) ;
          let AuthorCopy_emailBody=this.replacePlaceholders(AuthorCopy_emailTemplate[0].Body,createdByUser,id,nextApproverName,subjectMaster) ;
          const requestHeader1:Headers=new Headers();
          requestHeader1.append('Content-type','application/json');
          const httpClientOptions1:IHttpClientOptions={
          body:JSON.stringify({
                "to":this.state.existingItem.length>0? this.state.existingItem[0].Author.EMail:this.state.currentUser.Email,
                "cc":"",
                "subject":AuthorCopy_subject,
                "body":AuthorCopy_emailBody
              }),
          headers:requestHeader1
        };

        await this.props.context.httpClient.post(FlowUrls[0].Url,HttpClient.configurations.v1,httpClientOptions1).then((response:HttpClientResponse)=>{
          console.log(response);
        });
        }
      }
    }
  }

  public replacePlaceholders(orignalText:any,createdByUser:any,id:any,nextApproverName:any,subjectMaster:any){
    orignalText=orignalText.replace("$Author",createdByUser);
    orignalText=orignalText.replace("$Id",id).replace("$Id",id).replace("$Id",id);
    orignalText=orignalText.replace("$NextApprover",nextApproverName);
    orignalText=orignalText.replace("$CurrentUser",this.state.currentUser.Title);
    orignalText=orignalText.replace("$SubjectMaster",subjectMaster);
    
    Object.keys(this.state.formData).forEach((key:any)=>{
      try{
      orignalText=orignalText.replace('${'+key+'}',this.state.formData[key]);
      }catch{}
    });
    return orignalText;
  } 

  public toggleHideErrorForm(val:any){
    this.setState({hideErroDialog:true,errorMessage:""})
  }
  public toggleHideMsgForm(val:any){
    this.setState({hideMsgDialog:true,message:""})
  }
  public onSuccessMsgClick(){
    let id=this.state.updateItemId!=0?this.state.updateItemId:this.state.itemId;
    window.location.href=this.props.context.pageContext.web.absoluteUrl+"/SitePages/NewSpaForm.aspx?formid="+id;
  } 
  public onCancel(){
    window.location.href=this.props.cancelPageUrl;
  }

  public clearForm(){
    this.setState({formData:{"REQUESTER_x0020_NAME":"",
          "TEMPLATE_x0020_TYPE":"",
          "SUPPLIER_x0020_TYPE":"",
          "NEW_x0020_SUPPLIER_x0020_NAME":"",
          "EXISTING_x0020_SUPPLIER_x0020_NA":"",   
          "PRODUCT_x0020_TYPE":"",  
          "NEW_x0020_PRODUCT_x0020_NAME":"",
          "EXISTING_x0020_PRODUCT_x0020_NAM":"", 
          "UOM":"", 
          "QUANTITY":"0",
          "PRICE":"0",
          "VALUES_x0020_IN_x0020_RS":"0",
          "OCN_x0020_NUMBER":"",
          "OCN_x0020_DATE":null,
          "SHIPMENT":"",
          "OCN_x0020_SELLING_x0020_PRICE":"0",
          "MARGIN":"0",
          "MARGIN_x0020_PERCENTAGE":"0",
          "RM_x0020_ARRIVAL_x0020_DATE":null,
          "LEAD_x0020_TIME":"",
          "FINAL_x0020_PRICE":"0",
          "OCN_x0020_RM_x0020_PRICE":"0",
          "LAST_x0020_PURCHASE_x0020_PRICE":"0",
          "LAST_x0020_YEAR_x0020_AVERAGE_x0":"0",
          "SUPPLIER_x0020_NAME1":"",
          "SUPPLIER_x0020_NAME2":"",
          "SUPPLIER_x0020_NAME3":"",
          "SUPPLIER_x0020_PRICE1":"0",
          "SUPPLIER_x0020_PRICE2":"0",
          "SUPPLIER_x0020_PRICE3":"0",
          "EXCHANGE_x0020_RATE":"0",
          "INCO_x0020_TERMS":"",
          "PAYMENT_x0020_TERMS":"",
          "NATURE_x0020_OF_x0020_PURCHASE":"",
          "COMMENTS":"",
          "CURRENCY":"",
          "REFERENCE_x0020_NUMBER":"",
          "CHILLI_x0020_RELATED_x0020_PURCH":""  }});
  }

  public render(): React.ReactElement<ISpaFormProps> {
    const onFormatDate = (date?: Date): string => {
      return Helper.formatDate(date);
    };

    return (
      <div className='rootContainer'>
        {!this.state.loading ?
        <div className='mainContainer'  style={{position:"relative",zIndex:"1"}}>
          <header style={{position:"sticky",zIndex:"9",top:"0"}}>
            <div className='buttonSection' >
              <div className='buttonSectionInner'>
                <div>
                  <span className='gridsectionHeader' style={{fontSize:"25px"}}> ABM SPICES PROCUREMENT APPROVAL FORM</span>
                </div>
                <div>
                  {this.state.updateItemId == 0?
                    <PrimaryButton className='btnSave' iconProps={{ iconName: 'Save' }} onClick={this.onSave.bind(this)} >Submit</PrimaryButton>
                    :
                    (this.state.hasEditPermission &&  
                      (this.state.enabledEdit ? 
                        <PrimaryButton className='btnSave' iconProps={{ iconName: 'Save' }} onClick={this.onSave.bind(this)} >Update</PrimaryButton> :
                        <PrimaryButton className='btnSend' iconProps={{ iconName: 'Edit' }} onClick={()=>this.setState({enabledEdit:true,disableEdit:false})} >Edit</PrimaryButton>
                      )
                    )
                  }
                  {this.state.hasApprovalAccess && this.state.updateItemId != 0 && 
                  (this.state.existingItem[0]["APPROVAL_x0020_STATUS"]==WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2 ?
                    <PrimaryButton className='btnSave' iconProps={{ iconName: 'Save' }} onClick={this.onEntryLevel2Save.bind(this)} >Submit</PrimaryButton>
                  :
                    <>
                      <PrimaryButton className='btnSave' iconProps={{ iconName: 'CheckMark' }} onClick={this.onApproveRejectClick.bind(this,"Approved")} >Approve</PrimaryButton>
                      <PrimaryButton className='btnDelete' iconProps={{ iconName: 'Refresh' }} onClick={this.onApproveRejectClick.bind(this,"Reject")} >Reject</PrimaryButton>
                    </>)
                  }
                  <DefaultButton className='btnCancel' iconProps={{ iconName: 'Cancel' }} onClick={this.onCancel.bind(this)} >Cancel</DefaultButton>
                </div>
              </div>
            </div>
          </header>

          <div className='formContainer'>
            <div className='buttonSection' style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className='gridsectionHeader'><FontIcon  aria-label="Info" iconName="Info" className="iconClass" /> Request Information</span>
              {this.state.existingItem.length>0 && <span className="status">{this.state.existingItem[0]["APPROVAL_x0020_STATUS"]}</span>}
            </div>
            <div className='twoColumn' >
              <div><Label>REQUESTER NAME </Label> <TextField   disabled value={this.state.formData.REQUESTER_x0020_NAME?this.state.formData.REQUESTER_x0020_NAME:""} onChange={this.onTextBoxChangeEvent.bind(this,"REQUESTER_x0020_NAME")}  /></div>
              <div><Label>TEMPLATE TYPE <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.TEMPLATE_x0020_TYPE ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.TEMPLATE_x0020_TYPE} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"TEMPLATE_x0020_TYPE")} options={this.state.Master_dropdownValue["TEMPLATE TYPE"]} /></div>
            </div>
            <div className='twoColumn' >
              <div><Label>SUPPLIER TYPE <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_TYPE ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.SUPPLIER_x0020_TYPE} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"SUPPLIER_x0020_TYPE")} options={this.state.Master_dropdownValue["SUPPLIER TYPE"]} /></div>
              {(this.state.formData.SUPPLIER_x0020_TYPE =="EXIST" ||(this.state.existingItem.length>0 &&  this.state.formData.SUPPLIER_x0020_TYPE[0].value == "EXIST")) && <div><Label>EXISTING SUPPLIER NAME <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.EXISTING_x0020_SUPPLIER_x0020_NA ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.EXISTING_x0020_SUPPLIER_x0020_NA} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"EXISTING_x0020_SUPPLIER_x0020_NA")} options={this.state.Master_dropdownValue["EXISTING SUPPLIER NAME"]} /></div>}
              {(this.state.formData.SUPPLIER_x0020_TYPE =="NEW" ||(this.state.existingItem.length>0 &&  this.state.formData.SUPPLIER_x0020_TYPE[0].value == "NEW")) && <div><Label>NEW SUPPLIER NAME <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.NEW_x0020_SUPPLIER_x0020_NAME ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.NEW_x0020_SUPPLIER_x0020_NAME} onChange={this.onTextBoxChangeEvent.bind(this,"NEW_x0020_SUPPLIER_x0020_NAME")}  /></div>}
            </div>
            <div className='twoColumn' >
              <div><Label>PRODUCT TYPE <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.PRODUCT_x0020_TYPE ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.PRODUCT_x0020_TYPE} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"PRODUCT_x0020_TYPE")} options={this.state.Master_dropdownValue["PRODUCT TYPE"]} /></div>
              {(this.state.formData.PRODUCT_x0020_TYPE =="EXIST" ||(this.state.existingItem.length>0 &&  this.state.formData.PRODUCT_x0020_TYPE[0].value == "EXIST")) && <div><Label>EXISTING PRODUCT NAME <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.EXISTING_x0020_PRODUCT_x0020_NAM ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.EXISTING_x0020_PRODUCT_x0020_NAM} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"EXISTING_x0020_PRODUCT_x0020_NAM")} options={this.state.Master_dropdownValue["EXISTING PRODUCT NAME"]} /></div>}
              {(this.state.formData.PRODUCT_x0020_TYPE =="NEW" ||(this.state.existingItem.length>0 &&  this.state.formData.PRODUCT_x0020_TYPE[0].value == "NEW")) && <div><Label>NEW PRODUCT NAME <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.NEW_x0020_PRODUCT_x0020_NAME ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.NEW_x0020_PRODUCT_x0020_NAME} onChange={this.onTextBoxChangeEvent.bind(this,"NEW_x0020_PRODUCT_x0020_NAME")}  /></div>}
            </div> 
            <div className='twoColumn' >
              <div><Label>CHILLI RELATED PURCHASE <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"CHILLI_x0020_RELATED_x0020_PURCH")} options={this.state.Master_dropdownValue["CHILLI RELATED PURCHASE"]} /></div>
              <div><Label>CUSTOMER NAME <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.CUSTOMER_x0020_NAME ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.CUSTOMER_x0020_NAME} onChange={this.onTextBoxChangeEvent.bind(this,"CUSTOMER_x0020_NAME")}  /></div>
            </div>
          </div>
          <div className='formContainer'>
            <div className='buttonSection'>
              <span className='gridsectionHeader'><FontIcon  aria-label="Info" iconName="Info" className="iconClass" /> Material Information</span>
            </div>
            <div className='twoColumn'>
              <div><Label>QUANTITY <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.QUANTITY ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.QUANTITY} onChange={this.onTextBoxChangeEvent.bind(this,"QUANTITY")}  /></div>
              <div><Label>PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.PRICE ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.PRICE} onChange={this.onTextBoxChangeEvent.bind(this,"PRICE")}  /></div>
            </div>
            <div className='twoColumn' >
              <div><Label>CURRENCY <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.CURRENCY ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.CURRENCY} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"CURRENCY")} options={this.state.Master_dropdownValue["CURRENCY"]} /></div>
              <div><Label>EXCHANGE RATE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.EXCHANGE_x0020_RATE ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.EXCHANGE_x0020_RATE} onChange={this.onTextBoxChangeEvent.bind(this,"EXCHANGE_x0020_RATE")}  /></div>
            </div>
              <div className='twoColumn' >
              <div><Label>VALUES IN RS <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.VALUES_x0020_IN_x0020_RS ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.VALUES_x0020_IN_x0020_RS} onChange={this.onTextBoxChangeEvent.bind(this,"VALUES_x0020_IN_x0020_RS")}  /></div>
              <div><Label>UOM <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.UOM ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.UOM} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"UOM")} options={this.state.Master_dropdownValue["UOM"]} /></div>
            </div> 
            <div className='twoColumn'>
              <div><Label>OCN NUMBER <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.OCN_x0020_NUMBER ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.OCN_x0020_NUMBER} onChange={this.onTextBoxChangeEvent.bind(this,"OCN_x0020_NUMBER")}  /></div>
              <div><Label>OCN DATE  <span className='warning'>*</span></Label> <DatePicker className={this.state.showErrorBorder && this.state.formData.OCN_x0020_DATE ==null? "required":"notrequired"}  disabled={this.state.disableEdit} firstDayOfWeek={DayOfWeek.Sunday} formatDate={onFormatDate}   value={this.state.formData.OCN_x0020_DATE?this.state.formData.OCN_x0020_DATE:null} onSelectDate={this.onDateChange.bind(this,"OCN_x0020_DATE")}  /></div>
            </div>
            <div className='twoColumn'>
              <div><Label>SHIPMENT <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.SHIPMENT ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SHIPMENT} onChange={this.onTextBoxChangeEvent.bind(this,"SHIPMENT")}  /></div>
              <div><Label>REFERENCE NUMBER <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.REFERENCE_x0020_NUMBER ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.REFERENCE_x0020_NUMBER} onChange={this.onTextBoxChangeEvent.bind(this,"REFERENCE_x0020_NUMBER")}  /></div>
            </div>
            <div className='twoColumn'>
              <div><Label>RM ARRIVAL DATE  <span className='warning'>*</span></Label> <DatePicker className={this.state.showErrorBorder && this.state.formData.RM_x0020_ARRIVAL_x0020_DATE ==null? "required":"notrequired"}  disabled={this.state.disableEdit} firstDayOfWeek={DayOfWeek.Sunday} formatDate={onFormatDate}   value={this.state.formData.RM_x0020_ARRIVAL_x0020_DATE?this.state.formData.RM_x0020_ARRIVAL_x0020_DATE:null} onSelectDate={this.onDateChange.bind(this,"RM_x0020_ARRIVAL_x0020_DATE")}  /></div>
              <div><Label>LEAD TIME <span className='warning'>*</span></Label> <TextField className={this.state.showErrorBorder && this.state.formData.LEAD_x0020_TIME ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.LEAD_x0020_TIME} onChange={this.onTextBoxChangeEvent.bind(this,"LEAD_x0020_TIME")}  /></div>
            </div>
            <div className='twoColumn'>
              <div><Label>FINAL PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.FINAL_x0020_PRICE ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.FINAL_x0020_PRICE} onChange={this.onTextBoxChangeEvent.bind(this,"FINAL_x0020_PRICE")}  /></div>
              <div><Label>OCN RM PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.OCN_x0020_RM_x0020_PRICE ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.OCN_x0020_RM_x0020_PRICE} onChange={this.onTextBoxChangeEvent.bind(this,"OCN_x0020_RM_x0020_PRICE")}  /></div>
            </div>
            <div className='twoColumn'>
              <div><Label>LAST PURCHASE PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.LAST_x0020_PURCHASE_x0020_PRICE ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.LAST_x0020_PURCHASE_x0020_PRICE} onChange={this.onTextBoxChangeEvent.bind(this,"LAST_x0020_PURCHASE_x0020_PRICE")}  /></div>
              <div><Label>LAST YEAR AVERAGE PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.LAST_x0020_YEAR_x0020_AVERAGE_x0 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.LAST_x0020_YEAR_x0020_AVERAGE_x0} onChange={this.onTextBoxChangeEvent.bind(this,"LAST_x0020_YEAR_x0020_AVERAGE_x0")}  /></div>
            </div>
          </div>
          <div className='formContainer'>
            <div className='buttonSection'>
              <span className='gridsectionHeader'><FontIcon  aria-label="ConnectContacts" iconName="ConnectContacts" className="iconClass" /> Supplier Information</span>
            </div>
            <div className='twoColumn'>
              <div><Label>SUPPLIER NAME1 <span className='warning'>*</span></Label> <TextField   className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_NAME1 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_NAME1} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_NAME1")}  /></div>
              <div><Label>SUPPLIER PRICE1 <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_PRICE1 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_PRICE1} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_PRICE1")}  /></div>
            </div> 
            <div className='twoColumn'>
              <div><Label>SUPPLIER NAME2 <span className='warning'>*</span></Label> <TextField   className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_NAME2 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_NAME2} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_NAME2")}  /></div>
              <div><Label>SUPPLIER PRICE2 <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_PRICE2 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_PRICE2} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_PRICE2")}  /></div>
            </div> 
            <div className='twoColumn'>
              <div><Label>SUPPLIER NAME3 <span className='warning'>*</span></Label> <TextField  className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_NAME3 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_NAME3} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_NAME3")}  /></div>
              <div><Label>SUPPLIER PRICE3 <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.SUPPLIER_x0020_PRICE3 ==""? "required":"notrequired"} disabled={this.state.disableEdit} value={this.state.formData.SUPPLIER_x0020_PRICE3} onChange={this.onTextBoxChangeEvent.bind(this,"SUPPLIER_x0020_PRICE3")}  /></div>
            </div>
            <div className='twoColumn' >
              <div><Label>INCO TERMS <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.INCO_x0020_TERMS ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.INCO_x0020_TERMS} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"INCO_x0020_TERMS")} options={this.state.Master_dropdownValue["INCO TERMS"]} /></div>
              <div><Label>PAYMENT TERMS <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.PAYMENT_x0020_TERMS ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.PAYMENT_x0020_TERMS} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"PAYMENT_x0020_TERMS")} options={this.state.Master_dropdownValue["PAYMENT TERMS"]} /></div>
            </div>     
            <div className='twoColumn' >
              <div><Label>NATURE OF PURCHASE <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.NATURE_x0020_OF_x0020_PURCHASE ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.NATURE_x0020_OF_x0020_PURCHASE} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"NATURE_x0020_OF_x0020_PURCHASE")} options={this.state.Master_dropdownValue["NATURE OF PURCHASE"]} /></div>
              <div><Label>COMMENTS <span className='warning'>*</span></Label><TextField multiline rows={5}  value={this.state.formData.COMMENTS} className={this.state.showErrorBorder && this.state.formData.COMMENTS ==""? "required":"notrequired"} disabled={this.state.disableEdit}  onChange={this.onTextBoxChangeEvent.bind(this,"COMMENTS")}  /></div>
            </div>
          </div>  
          {(this.state.formData.TEMPLATE_x0020_TYPE == "RM TEMPLATE" || (this.state.existingItem.length>0 &&  this.state.formData.TEMPLATE_x0020_TYPE[0].value == "RM TEMPLATE")) && 
          <div className='formContainer'>
            <div className='buttonSection'>
              <span className='gridsectionHeader'><FontIcon  aria-label="ConnectContacts" iconName="ConnectContacts" className="iconClass" /> Entry Level 2 Information</span>
            </div>
            <div className='twoColumn' >
              <div><Label>ENTEY LEVEL2 REQUIRED <span className='warning'>*</span></Label> <Select className={this.state.showErrorBorder && this.state.formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE ==""? "custdropdown required":"notrequired"}  defaultValue={this.state.formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE} isDisabled={this.state.disableEdit} onChange={this.onDropdownChangeEvent.bind(this,"ENTEY_x0020_LEVEL2_x0020_REQUIRE")} options={this.state.Master_dropdownValue["ENTEY LEVEL2 REQUIRED"]} /></div>
              {(this.state.formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE =="YES" ||(this.state.existingItem.length>0 &&  this.state.formData.ENTEY_x0020_LEVEL2_x0020_REQUIRE[0].value == "YES")) && <div><Label>ENTEY LEVEL2 NAME <span className='warning'>*</span></Label> <TextField  disabled  value={this.state.formData.ENTEY_x0020_LEVEL2_x0020_NAME} onChange={this.onTextBoxChangeEvent.bind(this,"ENTEY_x0020_LEVEL2_x0020_NAME")}  /></div>}
           </div>
          {this.state.existingItem.length>0 && this.state.existingItem[0].APPROVAL_x0020_STATUS== WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2 && this.state.existingItem[0].Author.Id != this.state.currentUser.Id && this.state.currentUser.Email.toLowerCase()!= "sreekanth.shanmughan@abmauri.com" && 
            <><div className='twoColumn' >
              <div><Label>OCN SELLING PRICE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.OCN_x0020_SELLING_x0020_PRICE ==""? "required":"notrequired"} disabled={this.state.existingItem.length>0 && this.state.existingItem[0].APPROVAL_x0020_STATUS!= WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2} value={this.state.formData.OCN_x0020_SELLING_x0020_PRICE} onChange={this.onTextBoxChangeEvent.bind(this,"OCN_x0020_SELLING_x0020_PRICE")}  /></div>
              <div><Label>MARGIN PERCENTAGE <span className='warning'>*</span></Label> <TextField type='Number' className={this.state.showErrorBorder && this.state.formData.MARGIN_x0020_PERCENTAGE ==""? "required":"notrequired"} disabled={this.state.existingItem.length>0 &&  this.state.existingItem[0].APPROVAL_x0020_STATUS!= WorkFlowStatus.ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2} value={this.state.formData.MARGIN_x0020_PERCENTAGE} onChange={this.onTextBoxChangeEvent.bind(this,"MARGIN_x0020_PERCENTAGE")}  /></div>
            </div>
            <div className='twoColumn' >
              <div><Label>MARGIN <span className='warning'>*</span></Label> <TextField type='Number'  disabled  value={this.state.formData.MARGIN} /></div>
            </div></>
            }
          </div>}       
          <div className='formContainer' style={{marginBottom:"15px"}}>
            <div className='buttonSection'>
              <span className='gridsectionHeader'><FontIcon  aria-label="Attach" iconName="Attach" className="iconClass" /> Attachments</span>
            </div>
            
            { (this.state.updateItemId == 0 || (this.state.hasApprovalAccess && this.state.updateItemId != 0) || this.state.hasEditPermission) && 
            <div className='twoColumn'>
              <div>
                <Label>ATTACHMENTS</Label>
                <FilePicker buttonIcon="FileImage" context={this.props.context}
                   onSave={(filePickerResult: IFilePickerResult[]) => { this.setState({filePickerResult:filePickerResult }) }}
                    buttonLabel='Click here to add attachments' hideOneDriveTab hideSiteFilesTab hideWebSearchTab hideLinkUploadTab hideStockImages hideOrganisationalAssetTab hideRecentTab
                /> 
              </div>
            </div>}
            <div style={{display:"inline-flex"}}>
                {this.state.filePickerResult.length>0 && 
                  this.state.filePickerResult.map((item:any)=>{
                    return <div className='custTable'>
                      <span>{item.fileName}</span>
                      <FontIcon onClick={this.onDeleteAttachment.bind(this,item)} aria-label="Delete" iconName="Delete"   />
                    </div>
                  })
                }

                {this.state.existingItem !=null && this.state.existingItem.length>0 &&  this.state.existingItem[0].AttachmentFiles.length>0 &&
                  this.state.existingItem[0].AttachmentFiles.map((item:any)=>{
                     return <div className='custTable'>
                      <span><a target='_blank' href={item["ServerRelativeUrl"]}  data-interception="off" >{item["FileName"]}</a></span>
                    </div>
                     })
                  }
              </div>
          </div>


          {this.state.existingItem.length>0 && (this.state.existingItem[0]["APPROVAL_x0020_STATUS"].toLowerCase().indexOf("reject")!=-1 || (this.state.existingItem[0].RequesterComments !=null && this.state.existingItem[0].RequesterComments !=""))&&
            <div className='formContainer'>
              <div className='buttonSection'>
                <span className='gridsectionHeader'><FontIcon  aria-label="WorkItem" iconName="WorkItem" className="iconClass" />Requester Comments</span>
              </div>
              {this.state.hasEditPermission && this.state.existingItem[0]["APPROVAL_x0020_STATUS"].toLowerCase().indexOf("reject")!=-1 && <div  className='oneColumn'>
                <Label>Comments</Label>
                <TextField multiline rows={5} value={this.state.RequesterComments} className={this.state.showErrorBorder && this.state.RequesterComments ==""? "required":"notrequired"}  onChange={this.onTextBoxChangeEvent.bind(this,"RequesterComments")}  />
              </div>}
              {this.state.existingItem[0].RequesterComments !=null && this.state.existingItem[0].RequesterComments !="" && 
              <div className='hoursGrid'>
                <table cellPadding={0} cellSpacing={0}>
                  <tr>
                    <th>Comments</th>
                    <th>Action Date</th>
                    <th>Status</th> 
                  </tr> 
                  {this.state.existingItem[0].RequesterComments !=null && this.state.existingItem[0].RequesterComments !="" && 
                  JSON.parse(this.state.existingItem[0].RequesterComments).map((obj:any)=>{
                    return <tr> 
                    <td>{obj.comments}</td>
                    <td>{obj.date}</td>
                    <td>{obj.status}</td> 
                  </tr>
                  })
                  }
                </table>
              </div>}
            </div>
          }
 

          {this.state.existingItem.length>0 && <div className='formContainer' style={{marginBottom:"15px"}}>
            <div className='buttonSection'>
                <span className='gridsectionHeader'><FontIcon  aria-label="WorkItem" iconName="WorkItem" className="iconClass" /> Approval Details</span>
            </div>
            <div className='hoursGrid'>
              <table cellPadding={0} cellSpacing={0}>
                <tr>
                  <th>Role</th>
                  <th>Approver Name</th>
                  <th>Approver Email</th>
                  <th>Approved Comment</th>
                  <th>Rejected Comment</th>
                </tr> 
                 
                 {this.state.existingItem[0].PL_x0020_EMAIL != "" && this.state.formData.CHILLI_x0020_RELATED_x0020_PURCH == "YES" && 
                 <tr>
                  <td>PROCUREMENT LEAD APPROVAL</td>
                  <td>{this.state.existingItem[0].PL_x0020_NAME}</td>
                  <td>{this.state.existingItem[0].PL_x0020_EMAIL}</td>
                  <td>{this.state.existingItem[0].APPROVER1_x0020_COMMENTS}</td>
                  <td>{this.state.existingItem[0].APPROVER1_x0020_REASON_x0020_FOR}</td>
                </tr>}

                {this.state.existingItem[0].APPROVER_x0020_LEVEL1_x0020_EMAI != null && <tr>
                  <td>Approver 1</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL1_x0020_NAME}</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL1_x0020_EMAI}</td>
                  <td>{this.state.existingItem[0].APPROVER1_x0020_COMMENTS}</td>
                  <td>{this.state.existingItem[0].APPROVER1_x0020_REASON_x0020_FOR}</td>
                </tr>}

                {this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI != null &&<tr>
                  <td>Approver 2</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_NAME}</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL2_x0020_EMAI}</td>
                  <td>{this.state.existingItem[0].APPROVER2_x0020_COMMENTS}</td>
                  <td>{this.state.existingItem[0].APPROVER2_x0020_REASON_x0020_FOR}</td>
                </tr>}

                {this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI != null &&<tr>
                  <td>Approver 3</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_NAME}</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL3_x0020_EMAI}</td>
                  <td>{this.state.existingItem[0].APPROVER3_x0020_COMMENTS}</td>
                  <td>{this.state.existingItem[0].APPROVER3_x0020_REASON_x0020_FOR}</td>
                </tr>}

                {this.state.existingItem[0].APPROVER_x0020_LEVEL4_x0020_EMAI != null &&<tr>
                  <td>Approver 4</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL4_x0020_NAME}</td>
                  <td>{this.state.existingItem[0].APPROVER_x0020_LEVEL4_x0020_EMAI}</td>
                  <td>{this.state.existingItem[0].APPROVER4_x0020_COMMENTS}</td>
                  <td>{this.state.existingItem[0].APPROVER4_x0020_REASON_x0020_FOR}</td>
                </tr>}
              </table>
            </div>
          </div>}
        </div>
        :
        <ThemeProvider style={{width:"100%"}}>
              <Shimmer width="50%" />
              <Shimmer />
              <Shimmer width="75%" />
              <Shimmer width="50%" />
        </ThemeProvider>
        }
        <Dialog hidden={this.state.hideErroDialog} onDismiss={this.toggleHideErrorForm.bind(this)} dialogContentProps={Helper.dialogErrorProps}  modalProps={Helper.modalProps} minWidth={600}>
          <div>
            <div>Please fill the following required fields: </div>
            <div style={{padding:"5px 0",wordWrap:"break-word",fontSize:"9px",maxHeight:"350px",overflow:"auto"}}><b> <ul style={{listStyleType:"decimal"}}>{ this.state.errorMessage.split(',').map((item:any)=>{
              return item!=""&&<li>{item}</li>
            })}</ul></b> </div>
            {/* {this.state.invalidEmail &&<div style={{padding:"5px 0"}}><strong>Invalid Email</strong></div>} */}
            <div >Do you want to review them now?</div>
          </div>
          <DialogFooter className='alignCenter'>
            <PrimaryButton onClick={this.toggleHideErrorForm.bind(this,true)} text="Review" />
            <DefaultButton onClick={this.toggleHideErrorForm.bind(this,true)} text="Cancel" />
          </DialogFooter>
        </Dialog>

        <Dialog hidden={this.state.hideMsgDialog} dialogContentProps={Helper.dialogSuccessProps}  onDismiss={this.toggleHideMsgForm.bind(this)}  modalProps={Helper.modalProps} minWidth={600}>
            <div>
            <div>{this.state.message}</div>
          </div>
          <DialogFooter  className='alignCenter'>
            <PrimaryButton style={{marginTop:"10px"}} onClick={()=>this.onSuccessMsgClick()} text="OK" />
          </DialogFooter>
        </Dialog>
 
        <Dialog hidden={this.state.hideApproveRejectDig} onDismiss={()=>{this.setState({hideApproveRejectDig:true})}} dialogContentProps={Helper.dialogApproveRejectProps}  modalProps={Helper.modalProps} minWidth={600}>
          <div>
            <div  className='oneColumn'>
              <div><Label>Comments</Label>
                <TextField multiline rows={5} className={this.state.commentRequired ? "required":"notrequired"} value={this.state.ApprovalComments}  onChange={this.onTextBoxChangeEvent.bind(this,"ApprovalComments")}  />
                <Label>I have reviewed the request and attached required documents. </Label>
               </div>
            </div>
          </div>
          <DialogFooter className='alignCenter'>
            <PrimaryButton onClick={this.onApproveReject.bind(this,true)} text="Submit" />
            <DefaultButton onClick={()=>{this.setState({hideApproveRejectDig:true})}} text="Cancel" />
          </DialogFooter>
        </Dialog>

        {this.state.loading && <div className="modal">
          <div className="modal-content">
              <ClockLoader
              color="#000"
              loading={this.state.loading}
              cssOverride={Helper.clockLoaderProperty}
              size={60}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>}


      </div>
    );
  }
}

