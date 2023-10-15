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
    console.warn('No locations');
  };

}
