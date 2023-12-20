import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getDatabase, ref as ref_db, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() imgs1!: string[];
  @Input() imgs2!: string [];
  @Input() imgs3!: string[];
  @Input() postId!: number;
  @Output() closePostEvent = new EventEmitter<boolean>;

  public title = '';
  public subtitle = '';
  public date = '';
  public txt1 = '';
  public txt2 = '';
  public txt3 = '';
  public txt4 = '';

  public i1 = 0;
  public i2 = 0;
  public i3 = 0;

  async ngOnInit() {
    await this.fetchPostText(this.postId);
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
  };

  closePost(){
    this.closePostEvent.emit(false);
  }

}
