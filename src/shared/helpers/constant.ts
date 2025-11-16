export class ListTitles{
    constructor(){}
    public static readonly ExceptionLogs="ExceptionLogs";
    public static readonly SPAApprovers="SPAApprovers";
    public static readonly FlowUrls="FlowUrls";
    public static readonly EmailTemplate="EmailTemplate";
    
}

export class pages{
    public static page1="page1";
}

export class DropdownValues{
    constructor(){}
    public static readonly Status= [{"key":"Active","text":"Active"},{"key":"Inactive","text":"Inactive"}];
    public static readonly Gender= [{"key":"Male","text":"Male"},{"key":"Female","text":"Female"},{"key":"Other","text":"Other"}];
    public static readonly UserStatus= [{"key":"General","text":"General"},{"key":"Admin","text":"Admin"}];
}
 
export class ApprovalStatus{
    public static readonly Approved="Approved";
    public static readonly Reject="Reject";
    public static readonly Pending="Pending";
    public static readonly Scheduled="Scheduled";
    public static readonly Completed="Completed";
    public static readonly Expired="Expired";
    public static readonly InProgress="In Progress";
    public static readonly NotApplicable="Not Applicable";
    public static readonly Active="Active";
    public static readonly Inactive="Inactive";
}

export class WorkFlowStatus{
    public static readonly ENTRYLEVEL1COMPLETEDWAITINGFORENTRYLEVEL2="ENTRY LEVEL 1 COMPLETED WAITING FOR ENTRY LEVEL 2";  
    public static readonly ENTRYLEVELSCOMPLETEDWAITINGFORAPPROVALS="ENTRY LEVELS COMPLETED WAITING FOR APPROVALS"; 
    public static readonly APPROVER1APPROVED="APPROVER1 APPROVED"; 
    public static readonly APPROVER1REJECTED="APPROVER1 REJECTED"; 
    public static readonly APPROVER2APPROVED="APPROVER2 APPROVED"; 
    public static readonly APPROVER2REJECTED="APPROVER2 REJECTED"; 
    public static readonly APPROVER3APPROVED="APPROVER3 APPROVED"; 
    public static readonly APPROVER3REJECTED="APPROVER3 REJECTED"; 
    public static readonly APPROVER4APPROVED="APPROVER4 APPROVED"; 
    public static readonly APPROVER4REJECTED="APPROVER4 REJECTED"; 
    public static readonly PROCUREMENTAPPROVALCOMPLETED="PROCUREMENT APPROVAL COMPLETED"; 
    public static readonly WAITINGFORPROCUREMENTLEADAPPROVAL="WAITING FOR PROCUREMENT LEAD APPROVAL"; 
    public static readonly PLREJECTED="PL REJECTED"; 
    public static readonly WAITINGFORAPPROVAL1="WAITING FOR APPROVAL1"; 
    public static readonly WAITINGFORAPPROVAL2="WAITING FOR APPROVAL2"; 
    public static readonly WAITINGFORAPPROVAL3="WAITING FOR APPROVAL3"; 
    public static readonly WAITINGFORAPPROVAL4="WAITING FOR APPROVAL4"; 
}
 