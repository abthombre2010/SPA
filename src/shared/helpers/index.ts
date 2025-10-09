import { DialogType } from 'office-ui-fabric-react/lib';


export default class Helper {

  public  pageLimit=100;

  public fnExcelReport(tblName:string,fileName:any)
  {
      let htmls:any = "";
      let uri = 'data:application/vnd.ms-excel;base64,';
      let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'; 
      let base64 = function(s:any) {
          return window.btoa(unescape(encodeURIComponent(s)))
      };

      let format = function(s:any, c:any) {
          return s.replace(/{(\w+)}/g, function(m:any, p:any) {
              return c[p];
          })
      };

      htmls =  document.getElementById(tblName)?.outerHTML;
      htmls= htmls.replace(/<I[^>]*>|<\/I>/g, ""); 

      let ctx = {
          worksheet : 'Worksheet',
          table : htmls
      }


      let link = document.createElement("a");
      link.download = fileName+".xls";
      link.href = uri + base64(format(template, ctx));
      link.click();
  }

  public static toPrecision(value: number, precision: number): string {
    if (value) return value.toFixed(precision);
    else return "";
  }

  public static convertToISTTimeZone(date: Date): Date {
    let utcDate = date.toUTCString();
    let localDate = new Date(utcDate + " UTC");
    return localDate;
  }

  public static formatString(inputString: string, ...values: any[]): string {
    if (values) {
      for (let index = 0; index < values.length; index++) {
        inputString = inputString.replace("{" + index + "}", values[index]);
      }
    }
    return inputString;
  }

  public static _isValuePresent(value: any) {
    let isPresent = false;
    if (value) isPresent = true;
    return isPresent;
  }

  public static _checkRegex(regexPattern: any, valueToBeTested: any) {
    let isValid = false;
    let expressesion: RegExp = regexPattern;
    if (expressesion.test(valueToBeTested)) {
      isValid = true;
    }
    return isValid;
  }

  public static _checkMaxLength(valueToBeTested: any, lengthToBeTested: any) {
    let isValid = true;
    if (valueToBeTested && valueToBeTested.length > lengthToBeTested) {
      isValid = false;
    }
    return isValid;
  }

  public static _delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static currentDateTime(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  public static currentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
  }

   public static formatDate(date:any): string { 
    if(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     
    return `${day}/${month}/${year}`;
    }else return "";
  }

   public static formatDateYYYYMMDD(date:any): string { 
    if(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     
    return `${year}-${month}-${day}`;
    }else return "";
  }

   public static formatDateDDMMYYYY(date:any): string { 
    if(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
     
    return `${day}-${month}-${year}`;
    }else return "";
  }

  public static formatDateTime(dateTimeValue: string): string {
    const date = new Date(dateTimeValue);
    return date.toLocaleString();
  }

  public static formatNumber(
    numberValue: number,
    decimalPlaces: number = 2
  ): string {
    return numberValue.toFixed(decimalPlaces);
  }
  
   public static validateMobile(number:any){
    const mobileRegex = /^[+]?[\d ]{7,20}$/; 
    if (number !="" && !mobileRegex.test(number)) {
      return 'Invalid mobile number,';
    }
    return '';
  }

   public static validateEmail(email:any){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email!="" && !emailRegex.test(email)) {
      return 'Invalid email address,';
    }
    return '';
  }

  public static modalProps =  {
      isBlocking: true,
      dragOptions:  undefined,
    };

   public static dialogErrorProps = {
    type: DialogType.normal,
    title: 'Missing Required Fields',
    subText: '',
  }
  public static dialogDeletedProps = {
    type: DialogType.normal,
    title: 'Confirm Deletion',
    subText: 'Are you sure you want to delete this data?',
  }
   public static dialogSuccessProps = {
    type: DialogType.normal,
    title: 'Success',
    subText: '',
  }
   public static dialogApproveRejectProps = {
    type: DialogType.normal,
    title: 'Comments',
    subText: '',
  }
  

  public static clockLoaderProperty = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
  }

   
}