import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
admin.initializeApp();
export const fnSingInUser = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
    name: user.displayName || '',
    email: user.email || '',
    phone: user.phoneNumber || '',
    photo_url: user.photoURL || '',
    provider: user.providerData[0].providerId || '',
  });
});
