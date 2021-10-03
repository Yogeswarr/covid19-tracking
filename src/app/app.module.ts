import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsComponent } from './Components/charts/charts.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AboutComponent } from './Components/about/about.component';
import { HomeComponent } from './Components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { StatePageComponent } from './Components/state-page/state-page.component';
import { BarGraphComponent } from './Components/bar-graph/bar-graph.component'
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    NavbarComponent,
    AboutComponent,
    HomeComponent,
    StatePageComponent,
    BarGraphComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
