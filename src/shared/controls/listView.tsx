import * as React from 'react';
import { DetailsList, DetailsListLayoutMode,  SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import {FontIcon, Modal   } from 'office-ui-fabric-react/lib';
import Helper from '../helpers';
import {  ApprovalStatus } from '../../shared/helpers/constant';

interface IlistViewProps{
    columns:any;
    items:any;
    pageName:any;
}

interface IlistViewState{
    columns:any;
    items:any;
    showDialog:any;
    attachmentUrl:any;
}
export default class ListView extends React.Component<IlistViewProps,IlistViewState> {

  public constructor(props:any) {
    super(props);
    this.state={
        columns:[],
        items:[],
        showDialog:false,
        attachmentUrl:""
    }
  }

  componentDidMount(): void {
   this.getColumns(this.props.columns);
   this.setState({items:this.props.items});
  }

  componentWillReceiveProps(nextProps: Readonly<IlistViewProps>, nextContext: any): void {
      this.getColumns(nextProps.columns);
      this.setState({items:nextProps.items});
  }

  private getColumns(propColumn:any){
    let columns: any=[];
    let cols=propColumn ;
    if(cols!=null){
        for(let f=0;f<cols.length;f++){
            columns.push({
                key: 'column'+f,
                name: cols[f][1],
                fieldName: cols[f][0],
                minWidth: cols[f][3],
                maxWidth: cols[f][3],
                showSortIconWhenUnsorted:true,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: 'text',
                onRender: (item: any) => {
                return this.renderHtml(item,cols,f);
                },
                isPadded: true,  
            })
        }
        this.setState({columns:columns});
    } 
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = this._copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };

  public _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }
  
  public renderHtml(item:any,name:any,f:any){
    if(this.props.pageName == "Report_Contractor"){
      switch(name[f][0]){
        case "FirstName":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["FirstName"]:""}</span>; break;
        case "LastName":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["LastName"]:""}</span>; break;
        case "ContractorCompanyText":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["ContractorCompanyText"]:""}</span>; break;
        case "JobPositionText":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["JobPositionText"]:""}</span>; break;
        case "ContractorStatus":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["Status"]:""}</span>; break;
        case "ContractorType":  return <span>{item["ContractorName"]!=null?item["ContractorName"]["ContractorType"]:""}</span>; break;
        
        default: {
           switch(name[f][2]){
            case "date":
                if(item[name[f][0]]!=undefined) {
                  let d:any=Helper.formatDate(new Date(item[name[f][0]]));
                  return  <span>{d}</span>;
                }
                else
                  return <span>-</span>;
            default: return <span title={item[name[f][0]]} placeholder={item[name[f][0]]}>{item[name[f][0]]}</span>; break;
           }
        }
      }
    }else if(this.props.pageName == "Report_Employee"){
      switch(name[f][0]){
        case "FirstName":  return <span>{item["EmployeeName"]!=null?item["EmployeeName"]["FirstName"]:""}</span>; break;
        case "LastName":  return <span>{item["EmployeeName"]!=null?item["EmployeeName"]["LastName"]:""}</span>; break;
        case "BusinessUnitText":  return <span>{item["EmployeeName"]!=null?item["EmployeeName"]["BusinessUnitText"]:""}</span>; break;
        case "JobPositionText":  return <span>{item["EmployeeName"]!=null?item["EmployeeName"]["JobPositionText"]:""}</span>; break;
        case "EmployeeStatus":  return <span>{item["EmployeeName"]!=null?item["EmployeeName"]["Status"]:""}</span>; break;
        
        default: {
           switch(name[f][2]){
            case "date":
                if(item[name[f][0]]!=undefined) {
                  let d:any=Helper.formatDate(new Date(item[name[f][0]]));
                  return  <span>{d}</span>;
                }
                else
                  return <span>-</span>;
            default: return <span title={item[name[f][0]]} placeholder={item[name[f][0]]}>{item[name[f][0]]}</span>; break;
           }
        }
      }
    }else{
      switch(name[f][2]){
          case "link": {
            if(item["Status"]!=ApprovalStatus.Completed && item["Status"]!=ApprovalStatus.Reject){
              if(name[f][0]=="InductionCourseName"){
                let url=name[f][4];
                url=url.replace("{CourseID}",item["Id"]);
                return <a target='_blank' href={`${url}`}>{item[name[f][0]]}</a>;
              }else
                return <a target='_blank' href={`${name[f][4]}?formid=${item["Id"]}`}>{item[name[f][0]]}</a>;
            }else{
              return <span>{item[name[f][0]]}</span>
            }
          }
          case "date":
            if(item[name[f][0]]!=undefined) {
              let d:any=Helper.formatDate(new Date(item[name[f][0]]));
              return  <span>{d}</span>;
            }
            else
              return <span>-</span>;
          default:
              switch(name[f][0]){
                case "ContractorCompanyId":  return <span>{item["ContractorCompanyId"]!=null?item["ContractorCompany"]["Title"]:""}</span>; break;
                case "AttachmentFiles":{
                  if(item["AttachmentFiles"]!=null && item["AttachmentFiles"].length>0){
                    return  <div className='attachmentSec'>
                      {item["AttachmentFiles"].map((ele:any)=>{
                        return <a target='_blank' onClick={()=>{this.setState({attachmentUrl:ele["ServerRelativeUrl"],showDialog:true})}}   >{ele["FileName"]}</a>
                      })}
                    </div>
                  }
                }
                break;
                default: return <span title={item[name[f][0]]} placeholder={item[name[f][0]]}>{item[name[f][0]]}</span>;
              }
      }
    }
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }
    public render(): React.ReactElement<IlistViewProps> {
        return(
          <>
          <DetailsList
            items={this.state.items}
            compact={true}
            columns={this.state.columns}
            selectionMode={SelectionMode.none}
            getKey={this._getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
          />
           <Modal isOpen={this.state.showDialog} onDismiss={()=>{this.setState({showDialog:false})}} >
                <FontIcon style={{position:"absolute",right:"10px",top:"10px"}} onClick={()=>{this.setState({showDialog:false})}} aria-label="Cancel" iconName="Cancel" className="iconClass" /> 
                <iframe style={{margin:"10px",border:"0px",marginTop:"31px"}} height={500} width={800} src={this.state.attachmentUrl}></iframe>
            </Modal>
          </>
            
        )
    }
}