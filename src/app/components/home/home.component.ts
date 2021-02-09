import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/globalData';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData : GlobalDataSummary[];

  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  constructor(private dataService: DataServiceService) { }

    initChart(caseType: String){
      let datatable = [];
      datatable.push(["Country","Cases"])
      this.globalData.forEach(cs=>{
        let value: number;
        if(caseType=='c')
        if(cs.confirmed > 2000)
        value = cs.confirmed
        
        if(caseType=='d')
        if(cs.deaths > 1000)
        value = cs.deaths
       
        if(caseType=='a')
        if(cs.active > 2000)
        value = cs.active
        
        if(caseType=='r')
        if(cs.active > 2000)
        value = cs.active

        datatable.push([
          cs.country, value

        ])
      })
      console.log(datatable)
      this.pieChart = {
        chartType: 'PieChart',
        dataTable: datatable,
        //firstRowIsData: true,
        options: {'Country': 'Cases',height: 500, animation:{
          duration: 1000,
          easing: 'out',
        },},
      }
      this.columnChart = {
        chartType: 'ColumnChart',
        dataTable: datatable,
        //firstRowIsData: true,
        options: {'Country': 'Cases',height: 500, animation:{
          duration: 1000,
          easing: 'out',
        },},
      }
    }

  ngOnInit(){
    this.dataService.getGlobalData().subscribe(data=>{
      console.log(data);
      this.globalData = data;
      data.forEach(cs=>{
        if(!Number.isNaN(cs.confirmed)){
          this.totalActive+=cs.active
          this.totalConfirmed+=cs.confirmed
          this.totalDeaths+=cs.deaths
          this.totalRecovered+=cs.recovered
        }
     

      })
      this.initChart('c');
    })
  }
updateChart(input: HTMLInputElement){
  console.log(input)
  this.initChart(input.value)
}
}
