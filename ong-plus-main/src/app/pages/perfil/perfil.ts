import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { User, OngUser } from '../../models/user.model';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ProfileService } from '../../services/perfil.service';
import { MatSpinner } from '@angular/material/progress-spinner';
import { DashboardDoador } from '../dashboard-doador/dashboard-doador';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EditProfile } from '../../components/editperfil/editperfil';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSpinner,
    Header,
    Footer,
    EditProfile,
    DashboardDoador,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective
  ],
  providers: [DatePipe, provideNgxMask()],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  user!: User | OngUser;
  isOwnProfile = false;
  isLoading = true;
  showModal = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  profileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog // ✅ Novo
  ) {}

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const localUserId = localStorage.getItem('userId');

    const idToLoad = routeId || localUserId;
    if (!idToLoad) {
      console.error('Nenhum ID de usuário encontrado.');
      this.router.navigate(['/h']);
      return;
    }

    this.profileService.getUserProfile(idToLoad).subscribe({
      next: (user) => {
        this.user = user;
        this.isOwnProfile = idToLoad === localUserId;
        this.isLoading = false;
        this.initForm();
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        this.router.navigate(['/home']);
      }
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nome: [this.user.nome, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      telefone: [this.user.telefone || ''],
      fotoPerfil: [this.user.fotoPerfil || ''],
      rua: [this.user.endereco?.rua || ''],
      numero: [this.user.endereco?.numero || ''],
      cidade: [this.user.endereco?.cidade || ''],
      estado: [this.user.endereco?.estado || ''],
      ...(this.isOng(this.user) && {
        cnpj: [this.user.cnpj || ''],
        descricao: [this.user.descricao || ''],
        facebook: [this.user.redesSociais?.facebook || ''],
        instagram: [this.user.redesSociais?.instagram || '']
      })
    });
  }

  isOng(user: User | OngUser): user is OngUser {
    return user.tipo === 'ong';
  }

  formatCNPJ(cnpj: string): string {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM/yyyy') || '';
  }

  editarPerfil(): void {
  const dialogRef = this.dialog.open(EditProfile, {
    width: '900px',
    data: { user: this.user }
  });

  dialogRef.afterClosed().subscribe((updatedUser: User | OngUser) => {
    if (updatedUser) {
      this.user = updatedUser;
    }
  });
}


  closeModal(): void {
    this.showModal = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.patchValue({ fotoPerfil: e.target.result });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.profileForm.value;

    // Preparar dados para envio
    const updatedUser = {
      ...this.user,
      ...formData,
      endereco: {
        rua: formData.rua,
        numero: formData.numero,
        cidade: formData.cidade,
        estado: formData.estado
      }
    };

    if (this.isOng(this.user)) {
      (updatedUser as OngUser).redesSociais = {
        facebook: formData.facebook,
        instagram: formData.instagram
      };
    }

    // Primeiro upload da foto se houver
    if (this.selectedFile) {
      this.profileService.uploadProfilePhoto(this.user._id, this.selectedFile).subscribe({
        next: (res) => {
          updatedUser.fotoPerfil = res.url;
          this.updateUserProfile(updatedUser);
        },
        error: (err) => {
          console.error('Erro ao enviar foto:', err);
          this.updateUserProfile(updatedUser);
        }
      });
    } else {
      this.updateUserProfile(updatedUser);
    }
  }

  private updateUserProfile(userData: any): void {
    this.profileService.updateUserProfile(this.user._id, userData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isSubmitting = false;
        this.showModal = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.isSubmitting = false;
      }
    });
  }

  excluirPerfil(): void {
    if (!this.user?._id) return;

    const confirmado = confirm('Tem certeza que deseja excluir seu perfil? Esta ação é irreversível.');
    if (!confirmado) return;

    this.profileService.updateUserProfile(this.user._id, { ativo: false } as any).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao excluir perfil:', err);
      }
    });
  }
}
