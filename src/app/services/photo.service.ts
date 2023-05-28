import { Injectable } from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  public photos: UserPhoto[] = [];
  private photoStorage = 'photos';
  private platform: Platform;
  

  constructor(platform: Platform) {
    this.platform = platform;  
  }

  

  private async convertBase64(photo: Photo){
    if(photo.webPath){
      const res = await fetch(photo.webPath);
      const blob = await res.blob();
      return await this.convertBlobTo64(blob) as string;
    }
    return null;
  }

  private convertBlobTo64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.readAsDataURL(blob);
    })
  }

  private async saveToDevice(photo: Photo){
    const base64data = await this.convertBase64(photo);
    if(base64data){
      const filename = `Picture_${new Date().getTime()}.jpeg`;
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64data,
        directory: Directory.Data
      })
      return {
        filepath: filename,
        webviewPath: photo.webPath
      }
    }
    return null;
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
    this.photos.unshift({
      filepath: 'tbd',
      webviewPath: photo.webPath,
      favourite: false
    })
    this.saveToDevice(photo);
  }

  
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  favourite: boolean;    
}
