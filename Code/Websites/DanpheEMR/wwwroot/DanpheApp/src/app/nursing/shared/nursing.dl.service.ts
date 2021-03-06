import { Injectable, Directive } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { ImagingItemRequisition } from "../../radiology/shared/imaging-item-requisition.model"

@Injectable()
export class NursingDLService {
    public http: HttpClient;
   public options =  {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })};
    constructor(_http: HttpClient) {
        this.http = _http;
    }

    //Get Nursing Order detail list by patient iD
    public GetNursingOrderListByPatientId(patientID: number) {     
        return this.http.get<any>("/api/Billing?reqType=nursingOrderList" + "&patientId=" + patientID, this.options);    
    }

    public GetNephrologyPatients(){
      return this.http.get<any>("/api/Nursing/getNephrologyPatients", this.options);
    }
    //post all the imaging(radiology) requisition items
    public PostImagingItemsRequest(reqItemList: Array<ImagingItemRequisition>) {
        let data = JSON.stringify(reqItemList);
        return this.http.post<any>('/api/Radiology?reqType=postRequestItems', data, this.options);
    }

    //Post Billing Transaction Requisition Items 
    public PostBillingReqItems(billReqItems) {
        let data = JSON.stringify(billReqItems);
        return this.http.post<any>("/api/Billing?reqType=billItemsRequisition", data, this.options);
    }

    //Post Lab Nursing order requisition
    public PostLabItemsRequisition(requisitionObjString: string) {
        let data = requisitionObjString;
        return this.http.post<any>("/api/Lab?reqType=FromBillingToRequisition", data, this.options);

    }
    //Post Nursing drug requisition to pharmacy.
    public PostDrugsRequisition(requisitionObjString:string) {
        let data = requisitionObjString;
        return this.http.post<any>("/api/Pharmacy?reqType=drug-requistion", data, this.options);

    }
    
    public CancelRadRequest(data: string) {
        return this.http.put<any>("/api/Radiology?reqType=cancelInpatientRadRequest", data, this.options);
    }

    public CancelBillRequest(data: string) {
        return this.http.put<any>("/api/Billing?reqType=cancelInpatientBillRequest", data, this.options);
    }

    public SubmitHemoReport(data: string) {
        return this.http.post<any>("/api/Admission?reqType=submitHemoReport", data, this.options);
    }
    public CheckForLastReport(data: number) {
        return this.http.get<any>("/api/Admission?reqType=checkForLastReport" + "&patientId=" + data, this.options);
    }
    public PreviousReportList(data: number) {
            return this.http.get<any>("/api/Admission?reqType=previousReportList" + "&patientId=" + data, this.options);
        }
}
