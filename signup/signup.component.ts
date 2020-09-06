import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignupService } from './service/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  fName = false; lName = false; email = false; pwd = false; cpwd = false;
  errorText: any = '';
  password: any;
  show = false;
  disabled = false;
  buttonText = 'Register';
  signupForm = this.fb.group({
    firstName: [ '', Validators.minLength(2) ],
    lastName: [ '', Validators.minLength(2) ],
    email: [ '', Validators.email ],
    password: [ '', Validators.minLength(8) ]
  });

  constructor( private fb: FormBuilder, private signUp: SignupService, private router: Router ) { }

  ngOnInit(): void {
    this.password = 'password';
  }

  toggle(){
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  validation(val) {
    switch (val) {
      case 'lName':
        this.lName = this.signupForm.get('lastName').hasError('minlength');
        if (this.lName) {
          this.errorText = 'Atleast 2 character\'s';
          return;
        }
        this.errorText = '';
        break;
      case 'email':
        this.email = this.signupForm.get('email').hasError('email');
        if (this.email){
          this.errorText = 'Atleast enter a valid email';
          return;
        }
        const val = {
          campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
          data: {
            email: this.signupForm.value.email
          }
        };
        // Api to check if email exists in the database
        this.signUp.checkEmail(val).subscribe((event: HttpEvent<any>) => {
          let _api = this.signUp.HttpEventResponse(event);
          if (event.type === 4 ) {
            if (_api.data.status === 'EXISTS') {
              // console.log(_api.data.status);
              this.email = true;
              this.errorText = `Email already exists`;
              return;
            }
            // success class ?
            this.email = false;
            this.errorText = `Email is verified`;
          }
        }, ( err => {
          alert('Please try again after some time');
          console.log(err);
        }));
        break;
      case 'pwd':
        this.pwd = this.signupForm.get('password').hasError('minlength');
        if (this.pwd){
          this.errorText = 'Atleast 8 character\'s';
          return;
        }
        this.errorText = '';
        break;
      default:
        this.fName = this.signupForm.get('firstName').hasError('minlength');
        if (this.fName){
          this.errorText = 'Atleast 3 character\'s';
          return;
        }
        this.errorText = '';
    }
  }

  register($) {
    this.disabled = true;
    this.buttonText = 'Please Wait';
    const val = {
      campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
      data: this.signupForm.value
    };
    // Api to register in the database
    this.signUp.register(val).subscribe((event: HttpEvent<any>) => {
      let _api = this.signUp.HttpEventResponse(event);
      if (event.type === 4 ) {
        console.log(_api);
        this.router.navigate([`/`]);
      }
    }, ( err => {
      this.disabled = false;
      this.buttonText = 'Register';
      alert('Please try again after some time');
      console.log(err);
    }));
  }
}
