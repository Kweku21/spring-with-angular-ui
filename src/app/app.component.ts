import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./services/employee.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public employees :Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees():void{
    this.employeeService.getEmployees().subscribe(
      (response:Employee[]) =>{
        this.employees = response;
      },
      (error => {
        alert(error.message)
      })
    )
  }

  public onOpenModel(employee:Employee,mode:String) : void{

    const container = document.getElementById("main-container")
    const btn =document.createElement('button');
    btn.type = 'button'
    btn.style.display = 'none';
    btn.setAttribute('data-toggle','modal');
    // btn.setAttribute('data-toggle','modal');

    if (mode == 'add'){
      btn.setAttribute('data-target','#addEmployeeModal')
    }else if(mode == 'edit'){
      this.editEmployee = employee;
      btn.setAttribute('data-target','#updateEmployeeModal')
    }else if(mode == 'delete'){
      this.deleteEmployee = employee
      btn.setAttribute('data-target','#deleteEmployeeModal')
    }

    container.appendChild(btn);
    btn.click();

  }

  public onAddEmployee(addForm: NgForm):void {

    document.getElementById("add-employee-form").click();

    this.employeeService.addEmployee(addForm.value).subscribe(
      (response)=> {
        this.employees.push(response)
        // console.log(response);
        // this.getEmployees();
      },
      (error)=>{
        alert(error.message);
      }
    )
    addForm.reset();
  }

  public onUpdateEmployee(employee: Employee,updateForm:NgForm):void {

    // document.getElementById("add-employee-form").click();

    this.employeeService.updateEmployee(employee).subscribe(
      (response)=> {
        // this.employees.push(response)
        // console.log(response);
        this.getEmployees();
      },
      (error)=>{
        alert(error.message);
      }
    )
    updateForm.reset();
  }

  public onDeleteEmployee(employeeId: number):void {

    // document.getElementById("add-employee-form").click();

    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response)=> {
        console.log(response);
        this.getEmployees();
      },
      (error)=>{
        alert(error.message);
      }
    )
  }

  public searchEmployees(key:string):void{
    const results:Employee[] =[];

    for (const employee of this.employees){
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }

    this.employees = results;
    if (results.length == 0 || !key){
      this.getEmployees();
    }
  }
}
