import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimengComponentsComponent } from './primeng-components.component';

describe('PrimengComponentsComponent', () => {
  let component: PrimengComponentsComponent;
  let fixture: ComponentFixture<PrimengComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
