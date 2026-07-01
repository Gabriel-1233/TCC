import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ProfileService } from '../../services/perfil.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { User, OngUser } from '../../models/user.model';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    NgxMaskDirective,

  ],
  providers: [provideNgxMask()],
  templateUrl: './editperfil.html',
  styleUrls: ['./editperfil.css']
})
export class EditProfile implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  submitted = false;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  selectedArea: string = '';
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  areasAtuacaoOptions: string[] = [
    'Educação', 'Saúde', 'Meio Ambiente',
    'Assistência Social', 'Cultura', 'Direitos Humanos'
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public dialogRef: MatDialogRef<EditProfile>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | OngUser }
  ) {
    this.profileForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nome: [this.data.user.nome, Validators.required],
      email: [this.data.user.email, [Validators.required, Validators.email]],
      telefone: [this.data.user.telefone || ''],
      fotoPerfil: [this.data.user.fotoPerfil || ''],
      endereco: this.fb.group({
        rua: [this.data.user.endereco?.rua || ''],
        numero: [this.data.user.endereco?.numero || ''],
        complemento: [this.data.user.endereco?.complemento || ''],
        cidade: [this.data.user.endereco?.cidade || ''],
        estado: [this.data.user.endereco?.estado || ''],
        cep: [this.data.user.endereco?.cep || '']
      }),
      ...(this.isOng() && {
        cnpj: [this.data.user.cnpj || '', Validators.required],
        descricao: [this.data.user.descricao || '', Validators.required],
        site: [this.data.user.site || ''],
        areasAtuacao: this.fb.array(
          (this.data.user as OngUser).areasAtuacao?.length
            ? (this.data.user as OngUser).areasAtuacao.map(area => this.fb.control(area))
            : []
        ),
        redesSociais: this.fb.group({
          facebook: [this.data.user.redesSociais?.facebook || ''],
          instagram: [this.data.user.redesSociais?.instagram || ''],
          twitter: [this.data.user.redesSociais?.twitter || ''],
          linkedin: [this.data.user.redesSociais?.linkedin || '']
        })
      })
    });

    if (this.data.user.fotoPerfil) {
      this.previewImage = this.data.user.fotoPerfil;
    }
  }

  get areasAtuacaoArray(): FormArray {
    return this.profileForm.get('areasAtuacao') as FormArray;
  }

  addAreaAtuacao(area: string): void {
    if (area && !this.areasAtuacaoArray.value.includes(area)) {
      this.areasAtuacaoArray.push(this.fb.control(area));
      this.selectedArea = '';
    }
  }

  removeAreaAtuacao(index: number): void {
    this.areasAtuacaoArray.removeAt(index);
  }

  isOng(): this is { data: { user: OngUser } } {
    return this.data.user.tipo === 'ong';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.profileForm.patchValue({ fotoPerfil: e.target.result });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.profileForm.invalid) {
      this.mensagemErro = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.isSubmitting = true;
    const formValue = this.profileForm.value;

    const updatedUser: any = {
      ...this.data.user,
      ...formValue,
      endereco: {
        ...formValue.endereco
      }
    };

    if (this.isOng()) {
      updatedUser.redesSociais = {
        ...formValue.redesSociais
      };
      updatedUser.areasAtuacao = [...formValue.areasAtuacao];
    }

    if (this.selectedFile) {
      this.profileService.uploadProfilePhoto(this.data.user._id, this.selectedFile).subscribe({
        next: (res) => {
          updatedUser.fotoPerfil = res.url;
          this.updateUserProfile(updatedUser);
        },
        error: (err) => {
          console.error('Erro ao enviar foto:', err);
          this.mensagemErro = 'Erro ao enviar a foto. Tente novamente.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.updateUserProfile(updatedUser);
    }
  }

  private updateUserProfile(userData: any): void {
    this.profileService.updateUserProfile(this.data.user._id, userData).subscribe({
      next: (updatedUser) => {
        this.isSubmitting = false;
        this.mensagemSucesso = 'Perfil atualizado com sucesso!';
        setTimeout(() => {
          this.dialogRef.close(updatedUser);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.mensagemErro = 'Erro ao salvar perfil. Verifique os dados e tente novamente.';
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
