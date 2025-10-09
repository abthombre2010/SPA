export class ListTitles{
    constructor(){}
    public static readonly MasterDataFile ="Master Data File";
    public static readonly ExceptionLogs="ExceptionLogs";
    public static readonly STATEMASTER="STATEMASTER";
    public static readonly ProductDimensionMaster="ProductDimensionMaster";
    public static readonly RMAnalysisDimensionMaster="RMAnalysisDimensionMaster";
    public static readonly TransportTypeDimensionMaster="TransportTypeDimensionMaster";
    public static readonly ReviewersMasterList="ReviewersMasterList";
    public static readonly BankLevel1ApproverMaster="BankLevel1ApproverMaster";
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
    public static readonly WaitingForVerifierReview="Waiting For Verifier Review";
    public static readonly WaitingForTerritoryOfficerReview="Waiting For Territory Officer Review";
    public static readonly WaitingForTerritoryOfficerAndABFLReview="Waiting For Territory Officer & ABFL Review";
    public static readonly RejectedByVerifier="Rejected By Verifier";
    public static readonly WaitingforMDMCreation="Waiting for MDM Creation";
    public static readonly RejectedByTerritoryOfficer="Rejected By Territory Officer";
    public static readonly MDMCreated="MDM Created";
    public static readonly MDMRejected="MDM Rejected";
    public static readonly WaitingForReviewersReview="Waiting For Reviewers Review";
    public static readonly AfterReviewersReviewWaitingforMDMCreation="After Reviewers Review Waiting for MDM Creation";
    public static readonly PriceUpdationWaitingforApproval="Price Updation Waiting for Approval";
    public static readonly PriceUpdationWaitingforMDM="AppPrice Updation Waiting for MDMroved";
    public static readonly PriceUpdationApproverRejected="Price Updation Approver Rejected";
    public static readonly PriceUpdationCompleted="Price Updation Completed";
    public static readonly PriceUpdationMDMRejected="Price Updation MDM Rejected";
    public static readonly WaitingForBankChangesPlantReview="Waiting For Bank Changes Plant Review";
    public static readonly RejectedByBankChangesPlantReviewer="Rejected By Bank Changes Plant Reviewer";
    public static readonly FDAPPROVED="FD APPROVED";
    public static readonly ABFLAPPROVED="ABFL APPROVED";
    public static readonly RejectedByABFL="Rejected By ABFL";
    public static readonly MDMCANCELLED="MDM CANCELLED";
}
 