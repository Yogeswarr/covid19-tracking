import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsComponent } from './Components/charts/charts.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { AboutComponent } from './Components/about/about.component';
import { HomeComponent } from './Components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MapViewerComponent } from './Components/map-viewer/map-viewer.component';
import { StatePageComponent } from './Components/state-page/state-page.component';
import { BarGraphComponent } from './Components/bar-graph/bar-graph.component'

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    NavbarComponent,
    AboutComponent,
    HomeComponent,
    MapViewerComponent,
    StatePageComponent,
    BarGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
