import { Component, Directive, ViewChild } from '@angular/core';
import { ReportingService } from "../../../reporting/shared/reporting-service";
import { RPT_APPT_DistrictWiseAppointmentReportModel } from "./districtwise-appointment-report.model"
import { DLService } from "../../../shared/dl.service"
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment/moment';
import { MessageboxService } from '../../../shared/messagebox/messagebox.service';

@Component({
  templateUrl: "./districtwise-appointment-report.html"
})
export class RPT_APPT_DistrictWiseAppointmentReportComponent {
  public fromDate: Date = null;
  public toDate: Date = null;
  public distProvider: string = "";
  public doctorList: any;
  DistrictWiseAppointmentReportColumns: Array<any> = null;
  DistrictWiseAppointmentReportData: Array<any> = new Array<RPT_APPT_DistrictWiseAppointmentReportModel>();
  dynamicColumns: Array<string> = new Array<string>();
  public districtwiseappointment: RPT_APPT_DistrictWiseAppointmentReportModel = new RPT_APPT_DistrictWiseAppointmentReportModel();
  dlService: DLService = null;
  http: HttpClient = null;
  constructor(
    _http: HttpClient,
    _dlService: DLService,
    public msgBoxServ: MessageboxService,
    public reportServ: ReportingService) {
    // this.DistrictWiseAppointmentReportColumns = ReportGridColumnSettings.DistrictWiseAppointmentReport;
    this.http = _http;
    this.dlService = _dlService;
    this.districtwiseappointment.fromDate = moment().format('YYYY-MM-DD');
    this.districtwiseappointment.toDate = moment().format('YYYY-MM-DD');
  }
  gridExportOptions = {
    fileName: 'DistrictwiseAppointmentList_' + moment().format('YYYY-MM-DD') + '.xls',
    //displayColumns: ['PatientCode', 'ShortName', 'Gender', 'MiddleName', 'DateOfBirth', 'PhoneNumber']
  };

  Load() {
    this.dlService.Read("/Reporting/DistrictwiseAppointmentReport?FromDate="
      + this.districtwiseappointment.fromDate + "&ToDate=" + this.districtwiseappointment.toDate + "&CountrySubDivisionName=" + this.districtwiseappointment.distProvider)
      .map(res => res)
      .subscribe(res => this.Success(res),
        res => this.Error(res));
  }
  Error(err) {
    this.msgBoxServ.showMessage("error", [err]);
  }
  Success(res) {
    if (res.Status == "OK" && res.Results.JsonData) {
      //res.Results.Schema is  the array of JSON data object
      //after parsing we can get the collection of object data with commas separated data and [0] is the bydefault object 
      // after that we can split the collection object data
      this.dynamicColumns = JSON.parse(res.Results.Schema)[0].ColumnName.split(',');
      this.DistrictWiseAppointmentReportColumns = this.reportServ.reportGridCols.GetColumnSettings(this.dynamicColumns);
      this.DistrictWiseAppointmentReportData = JSON.parse(res.Results.JsonData);
    }
    else if (res.Status == "OK" && res.Results.JsonData == null) {
      this.msgBoxServ.showMessage("notice-message", ['Data is Not Available Between Selected dates...Try Different Dates']);
    }
    else {
      this.msgBoxServ.showMessage("failed", [res.ErrorMessage]);
    }
  }
}
