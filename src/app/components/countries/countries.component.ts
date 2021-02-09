import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/globalData';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
data: GlobalDataSummary[];
countries: string[] = [];
loading = true;
totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  }
  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.dataService.getDateWiseData().pipe(map(result=>{
        this.dateWiseData = result;

      })),
      this.dataService.getGlobalData().pipe(map(result=>{
        this.data = result;
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
      }))
    ).subscribe({
      complete:() => {
      this.updateValues('India')  
      this.loading = false;
      
      }
    })

    // this.dataService.getDateWiseData().subscribe(result=>{
    //   this.dateWiseData = result;
    //   this.updateChart();
    //   // console.log(result);
    // })

    // this.dataService.getGlobalData().subscribe(result=>{
    //   this.data = result;
    //   this.data.forEach(cs=>{
    //     this.countries.push(cs.country)
    //   })
    // })
  }

  updateChart(){
    let dataTable = [];
    dataTable.push(['Date', 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date,cs.cases])
      
    })
    this.lineChart ={
      chartType: 'LineChart',
      dataTable: dataTable,
      options: {height: 500, animation:{
        duration: 1000,
        easing: 'out',
      },},
      

    }
  }

  updateValues(country: string){
    console.log(country)
    this.data.forEach(cs=>{
      if(cs.country==country){
        this.totalActive=cs.active
        this.totalDeaths=cs.deaths
        this.totalRecovered=cs.recovered
        this.totalConfirmed=cs.confirmed
      }
    })
    this.selectedCountryData = this.dateWiseData[country]
    this.updateChart();
    console.log(this.selectedCountryData);
  }
}
