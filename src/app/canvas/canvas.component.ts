import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('paintCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() currentColor : string = '';
  private ctx!: CanvasRenderingContext2D | null;
  private isDrawing = false;
  brushColor: string = '#000000';
  backgroundColor: string = '#FFFFFF';
  brushSize: number = 5;
  isErasing = false;
  hasDrawing : boolean = false;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      canvas.width = window.innerWidth - 40;
      canvas.height = 700;
      this.setCanvasBackground('#ffffff');
      this.setupCanvas();
    }
  }

  setCanvasBackground(color: string) {
    if (this.ctx) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
  }

  

  private setupCanvas() {
    if (!this.ctx) return;
    
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('mousedown', (event) => this.startDrawing(event));
    canvas.addEventListener('mousemove', (event) => this.draw(event));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseleave', () => this.stopDrawing());
  }

  private startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.draw(event);
  }

  private draw(event: MouseEvent) {
    if (!this.isDrawing || !this.ctx) return;

    this.hasDrawing = true; 
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.brushColor;
    if (this.isErasing) {
      this.ctx.strokeStyle = this.backgroundColor;
    } else {
      this.ctx.strokeStyle = this.brushColor;
    }
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  private stopDrawing() {
    this.isDrawing = false;
    if (this.ctx) this.ctx.beginPath();
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    this.hasDrawing = false; 
  }

  toggleEraser() {
    this.isErasing = !this.isErasing;
  }

  exportCanvas(){
    if (!this.canvasRef || !this.hasDrawing) {
      alert("Draw something before exporting!");
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const image = canvas.toDataURL("image/png");
  
    const link = document.createElement("a");
    link.href = image;
    link.download = "drawing.png"; 
    link.click();
  }
}
