import { firebaseConfig } from '../../firebase/firebase.config';

export const environment = {
  production: true,
  youtube_api_key: "AIzaSyBTfpeDChRfmYSgBevDVHcCEdkiPDNqdBs",
  aqi_api_key: "655a2796ba9301e9aa31a2119528c6dfaa383f53",
  mockBackend: false,
  firebaseConfig: firebaseConfig  // Using staging config for all environments
};
