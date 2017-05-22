import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
/*
Component - directive with decorator to assign a template and selector;

*/

import { MyStructuralDirective } from './my-structural-directive.directive';
import { FixedPartOfTheDynamicComponent } from './fixed-part-of-dynamic.component';
import { DynamicComponent } from './app.dynamic.component';
import { DynamicComponent1 } from './dynamic1.component';
import { DynamicComponent2 } from './dynamic2.component';
import { MockDataService } from './services/mocks-data.service'
import { MockDataModel } from './data-models/mock-data.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  mocks: MockDataModel[];

  /* CONSTRUCTOR */
  // constructs the component factory resolver and the data service for loading the mocks
  constructor(private myComponentFactoryResolver: ComponentFactoryResolver, private mockService: MockDataService) {
    this.getMocks();
  };


  /* KEEPING DYNAMIC COMPONENTS */
  // the place to keep the dynamic components and feeding them with the mocks data, they will not be created at this point
  dynamicComponents: DynamicComponent[] = [
    new DynamicComponent(DynamicComponent1, this.mocks[0]), // needing new instances of that dynamic component because ???
    new DynamicComponent(DynamicComponent2, this.mocks[1])
  ];

  /* HOST FOR THE DYNAMIC COMPONENT */
  // this pre-build directive is accessing the html directive which is the reference for the dynamic component
  // in this case it is the "MyStructuralDirective"
  @ViewChild(MyStructuralDirective) componentHost: MyStructuralDirective;


  /* LOADING DYNAMIC COMPONENTS */
  // life cycle hook that explores the dynamic possible child elements to be able to build them later on in runtime 
  // or it creates the child views to Angular terminology
  ngAfterViewInit() {
    this.loadMyDynamicComponent();
  }



  loadMyDynamicComponent() {
    let containerWhereToAttachTheView = this.componentHost.vCR; // reference from the directive
    /* get the constructed and public viewContainerReference instance which will create the dynamic component */
    containerWhereToAttachTheView.clear(); /* I am changing the html inside the dynamic component therefore I have to clear everytime if I want to have smth new*/


    let myComponentFactory = this.myComponentFactoryResolver.resolveComponentFactory(this.dynamicComponents[0].component); /* Take the first one and from that the component */
    /* renders the dynamic component instance into the app.component instance */

    let myComponentReference = containerWhereToAttachTheView.createComponent(myComponentFactory); /* A new reference but htis time not the the host , to the actual new html that is fromm the new created component */

    (<FixedPartOfTheDynamicComponent>myComponentReference.instance).data = this.dynamicComponents[1].data; /* assign the keeper of the dynamic components some data to
    populate the templates in the dynamic components */

    /*Taking the first one and aksinmg for the data */
  }


  getMocks() {
    this.mocks = this.mockService.getMocks()
  }

}

