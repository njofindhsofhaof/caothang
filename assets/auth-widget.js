/* Widget dang nhap Google (gioi han domain truong) + luu/doc ket qua qua Firestore.
   Dung chung cho moi trang trac nghiem trong repo caothang. */
(function () {
  "use strict";
  if (!window.firebase || !window.CAOTHANG_FIREBASE_CONFIG) {
    console.error("Firebase SDK hoac cau hinh (assets/firebase-config.js) chua duoc nap.");
    return;
  }

  firebase.initializeApp(window.CAOTHANG_FIREBASE_CONFIG);
  var auth = firebase.auth();
  var db = firebase.firestore();
  var ALLOWED_DOMAIN = window.CAOTHANG_ALLOWED_EMAIL_DOMAIN || "caothang.edu.vn";

  var currentUser = null;
  var listeners = [];

  function isAllowedEmail(email) {
    return !!email && email.toLowerCase().indexOf("@" + ALLOWED_DOMAIN) === email.length - ALLOWED_DOMAIN.length - 1;
  }

  auth.onAuthStateChanged(function (user) {
    if (user && !isAllowedEmail(user.email)) {
      auth.signOut();
      currentUser = null;
      alert("Tai khoan " + user.email + " khong thuoc domain @" + ALLOWED_DOMAIN + ". Vui long dang nhap bang email cua truong.");
      listeners.forEach(function (cb) { cb(null); });
      return;
    }
    currentUser = user;
    listeners.forEach(function (cb) { cb(user); });
  });

  function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ hd: ALLOWED_DOMAIN });
    return auth.signInWithPopup(provider);
  }

  function signOutUser() {
    return auth.signOut();
  }

  function saveResult(data) {
    if (!currentUser) {
      return Promise.reject(new Error("Ban can dang nhap bang Google (@" + ALLOWED_DOMAIN + ") de luu ket qua."));
    }
    var payload = Object.assign({}, data, {
      uid: currentUser.uid,
      name: currentUser.displayName || "",
      email: currentUser.email,
      photoURL: currentUser.photoURL || "",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return db.collection("results").add(payload).then(function (ref) { return ref.id; });
  }

  function loadResult(id) {
    return db.collection("results").doc(id).get().then(function (snap) {
      return snap.exists ? snap.data() : null;
    });
  }

  function onAuthChange(cb) {
    listeners.push(cb);
  }

  function getUser() {
    return currentUser;
  }

  function renderWidget(container) {
    function paint() {
      if (currentUser) {
        container.innerHTML =
          '<div class="cta-user">' +
          (currentUser.photoURL ? '<img class="cta-avatar" src="' + currentUser.photoURL + '" alt="">' : '') +
          '<span class="cta-name">' + (currentUser.displayName || currentUser.email) + '</span>' +
          '<button class="cta-btn cta-btn-out" type="button" id="ctaSignOut">Dang xuat</button>' +
          '</div>';
        document.getElementById("ctaSignOut").onclick = function () { signOutUser(); };
      } else {
        container.innerHTML = '<button class="cta-btn" type="button" id="ctaSignIn">Dang nhap Google (@' + ALLOWED_DOMAIN + ')</button>';
        document.getElementById("ctaSignIn").onclick = function () {
          signIn().catch(function (err) {
            alert("Dang nhap that bai: " + (err && err.message ? err.message : err));
          });
        };
      }
    }
    onAuthChange(paint);
    paint();
  }

  window.CaoThangAuth = {
    signIn: signIn,
    signOut: signOutUser,
    saveResult: saveResult,
    loadResult: loadResult,
    onAuthChange: onAuthChange,
    getUser: getUser,
    renderWidget: renderWidget,
    isAllowedEmail: isAllowedEmail,
    ALLOWED_DOMAIN: ALLOWED_DOMAIN
  };
})();
