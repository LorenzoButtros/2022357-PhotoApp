import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public photoService: PhotoService) {}
  
  // Function that marks the clicked photo as a favourite
  makeFavourite(index: number) {
    if(!this.photoService.photos[index].favourite){
      this.photoService.photos[index].favourite = true;
    }else{
      this.photoService.photos[index].favourite = false;
    }
  }

}
