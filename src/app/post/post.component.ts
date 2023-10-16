import { Component, OnInit } from '@angular/core';
import { getDatabase, ref as ref_db, onValue, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start
import { getStorage, ref as ref_storage, listAll, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  public title: string = '';
  public subtitle: string = '';
  public date: string = '';
  public txt1: string = '';
  public txt2: string = '';
  public txt3: string = '';
  public txt4: string = '';

  public i1 = 0;
  public i2 = 0;
  public i3 = 0;

  public imgs1 = [
    'https://ep01.epimg.net/elcomidista/imagenes/2022/10/31/articulo/1667206537_604382_1667230832_noticia_normal.jpg',
    'https://storage.googleapis.com/css-photos/menu-photos/1d2d5a63-1603-473b-9464-e8fa6787f40b.jpeg',
    'https://ep01.epimg.net/elcomidista/imagenes/2022/01/11/receta/1641893642_902475_1641893828_noticia_normal.jpg',
  ];
  public imgs2 = [
    'https://ep01.epimg.net/elcomidista/imagenes/2022/10/31/articulo/1667206537_604382_1667230832_noticia_normal.jpg',
    'https://storage.googleapis.com/css-photos/menu-photos/1d2d5a63-1603-473b-9464-e8fa6787f40b.jpeg',
    'https://ep01.epimg.net/elcomidista/imagenes/2022/01/11/receta/1641893642_902475_1641893828_noticia_normal.jpg',
  ];
  public imgs3 = [
    'https://ep01.epimg.net/elcomidista/imagenes/2022/10/31/articulo/1667206537_604382_1667230832_noticia_normal.jpg',
    'https://storage.googleapis.com/css-photos/menu-photos/1d2d5a63-1603-473b-9464-e8fa6787f40b.jpeg',
    'https://ep01.epimg.net/elcomidista/imagenes/2022/01/11/receta/1641893642_902475_1641893828_noticia_normal.jpg',
  ];

  async ngOnInit() {
    await this.fetchPostText(1);
  }

  async fetchPostText(postId: number) { 
    const db = getDatabase();
    const dbRef = ref_db(db);

    let snapshot = await get(child(dbRef, `posts/${postId}`));
    if (snapshot.exists()) {
      let postData = snapshot.val();
      this.title = postData.title;
      this.subtitle = postData.subtitle;
      this.date = postData.date;
      this.txt1 = postData.txt1;
      this.txt2 = postData.txt2;
      this.txt3 = postData.txt3;
      this.txt4 = postData.txt4;
      return;
    };
    console.warn('No data');
  };

  getSlide(imgs: string[], i: number, carouselNum: number) {
    this.changeImgNum(carouselNum, i);
    return imgs[i];
  }

  getPrev(imgs: string[], i: number, carouselNum: number) {
    i == 0 ? (i = imgs.length - 1) : i--;
    this.changeImgNum(carouselNum, i);
  }

  getNext(imgs: string[], i: number, carouselNum: number) {
    i < imgs.length - 1 ? i++ : (i = 0);
    this.changeImgNum(carouselNum, i);
  }

  // TODO clean code rsrs
  changeImgNum(carouselNum: number, i: number){
    switch(carouselNum){
      case 1:
        this.i1 = i;
        break;
      case 2:
        this.i2 = i;
        break;
      case 3:
        this.i3 = i;
        break;
    }
  }

}
