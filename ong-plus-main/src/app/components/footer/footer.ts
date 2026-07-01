import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  typedText = '';
  fullText = '© ' + this.currentYear + ' ONG+ | Feito com ♥ pelo Bruno';

  ngOnInit() {
    this.typeWriter();
  }

  typeWriter() {
    let i = 0;
    const typing = setInterval(() => {
      if (i < this.fullText.length) {
        this.typedText += this.fullText.charAt(i);
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
  }

 showMission = false;
missionProgress = 72; // Exemplo - pode ser dinâmico

toggleMission() {
  this.showMission = !this.showMission;
  if (this.showMission) {
    // Anima o progresso quando abre
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      this.missionProgress = Math.min(progress, 72);
      if (progress >= 72) clearInterval(interval);
    }, 30);
  }
}
}
