import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;

  activeTab = 'profile'; // 'profile' or 'password'

  loading = false;
  profileSuccess = false;
  profileError = '';

  passwordLoading = false;
  passwordSuccess = false;
  passwordError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  // تبديل التبويب النشط
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // تحديث الملف الشخصي
  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.profileSuccess = false;
    this.profileError = '';

    // في تطبيق حقيقي، سيتم استدعاء خدمة لتحديث الملف الشخصي
    // هنا نقوم بمحاكاة نجاح العملية بعد تأخير
    setTimeout(() => {
      this.loading = false;
      this.profileSuccess = true;

      // تحديث بيانات المستخدم المحلية
      if (this.currentUser) {
        const updatedUser = {
          ...this.currentUser,
          name: this.profileForm.value.name,
          email: this.profileForm.value.email
        };

        // في تطبيق حقيقي، سيتم تحديث المستخدم في الخادم
        // ثم تحديث المستخدم المحلي
      }
    }, 1000);
  }

  // تغيير كلمة المرور
  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordLoading = true;
    this.passwordSuccess = false;
    this.passwordError = '';

    // في تطبيق حقيقي، سيتم استدعاء خدمة لتغيير كلمة المرور
    // هنا نقوم بمحاكاة نجاح العملية بعد تأخير
    setTimeout(() => {
      this.passwordLoading = false;
      this.passwordSuccess = true;
      this.passwordForm.reset();
    }, 1000);
  }

  // التحقق من تطابق كلمات المرور
  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // الحصول على حقول النموذج
  get f() { return this.profileForm.controls; }
  get p() { return this.passwordForm.controls; }

  // تسجيل الخروج
  logout(): void {
    this.authService.logout();
  }
}
