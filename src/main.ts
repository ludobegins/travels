import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../env'

platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));

const app = initializeApp(firebaseConfig);

