import { localStorageRetrieve } from "./utilities";
const english = "en-US"
const arabic = "ar"
let language = localStorageRetrieve("language");

if (language==null)
  language=english

export function movieStatus(status) {
  if(language== english)
    return status
  if(language ==arabic)  
    switch (status) {
      case "Rumored":
        return "اشاعة";
      case "Planned":
        return "مخطط";
      case "In Production":
        return "قيد الإنتاج";
      case "Post Production":
        return "مرحلة ما بعد الإنتاج";
      case "Released":
        return "صدر";
      case "Canceled":
        return "ملغى";
      default:
        return status;
    }
}

export function popupLoginWarning(){
  switch(language){
    case english:
      return {title:"Warning!", message:`<p>Your data will be store in the local storage and removing browser data will going to remove all your <b>info!</b></p> <p style=direction:rtl></p>`}
    case arabic:
      return {title:"!تحذير", message:`!جميع بيناتك ستخزن بالمتصفح, مسح بينات المتصفح تؤدي الى مسح جميع معلوماتك المخزنة`}
  }
}

export function translateLoginPage(){
  switch(language){
    case english:
      return {header:<h1>Manage your favorite Movies and Tv shows.</h1>, description: <><p>CFlix is a clone website of Netflix and Tv Time app to manage your favorite movies and tv shows, explore Trending shows and more...</p><p>Note: You can't use CFlix to watch actual Movies, Tv show!</p></>, googleButton:"Sign in with Google", guestButton:"Or Join as a Guest"}
    case arabic:
      return {header:<h1>رتب افلامك ومسلسلاتك الي تحبها</h1>, description: <><p>سي-فلكس هو موقع نسخة تامة من نتفلكس وتطبيق تيفي تايم لإدارة وترتيب افلامك وبرامجك المفضلة واستكشاف الجديد من الفلام والمسلسلات المفضلة لديك في منصة واحدة</p><p>!ملاحظة: لايمكنك استخدام الموقع لمشاهدة الافلام والمسلسلات</p></>, googleButton:"سجل دخولك بقوقل", guestButton:"سجل كزائر"}
  }
}

export function translateNavbar(){
  switch(language){
    case english:
      return {SignOut:'Sign Out',language:'Choose your language', discover:"Discover", mylist:"My List", searchResult:"Nothing Found!", searchPlaceholder:"Search for your favorite Movie and TV Show...." }
    case arabic:
      return {SignOut:'تسجيل الخروج',language:'اختر لغتك', discover:"أكتشف", mylist:"قائمة المشاهدة", searchResult:"!معليش, مالقيت شي", searchPlaceholder:"ابحث عن فلمك ومسلسلك المفضل هنا..."  }
  }
}

export function translateMyList(){
  switch(language){
    case english:
      return {tvWatched:"Watched episodes",movieWatched:"Watched Movies", time:["Minutes", "Hours", "Days","Months"], episode:['Episode'], movie:['Movie'], seriesTitle: "Series", moviesTitle: "Movies",
              watchedBefore: "Watched Before", notStarted:"Not yet started",towatch:"Continue Watching", Untilnow:"Until now", finished:"Finished"}
    case arabic:
      return {tvWatched:"حلقات تمت مشاهدتها", movieWatched:"أفلام تمت مشاهدتها", time:["دقائق", "ساعات", "ايام","شهور"], episode:['حلقة'], movie:['فلم'], seriesTitle: "مسلسلات", moviesTitle: "أفلام",
      watchedBefore: "شوهد مسبقا", notStarted:"لم يبدأ", towatch:"أكمل المشاهدة", Untilnow:"حتى الأن", finished:"مكتمل"}

  }
}

export function translatePopup(){
  switch(language){
    case english:
      return {playButton:"Play", addRemoveButton:["Remove","Add"], watched:["Not yet Watched", "Watched"],  thatIsAll:"That's All", production:["Until now", "Finished"],
              tobecontinue: "To be continue...", aboutTab: "about",episodeTab:"Episodes",
              Genres: "Genres:", dates:"Dates:", numbers:"Numbers:", general:"General:",
              movie_runtime:"Movie Runtime:", movie_hour:"hour and", movie_min:"min",
              cost: "estimated cost", first_episode:"First episode", last_episode:"Last episode so far",
              next_episode_to_air:"Next episode to air, Episode", season:"Season", day:"day",
              totalEpisodes: "Total # of episodes:" ,totalSeasons: "Total # of Seasons:", tvRuntime: "Tv Runtime: ", discussion: "Discussion" }
    case arabic:
      return {playButton:"تشغيل", addRemoveButton:["إزالة","إضافة"], watched:["لم تشاهد", "تمت المشاهدة"], thatIsAll:"!هذا كله, يالربع", production:["حتى الأن", "منتهي"],
              tobecontinue: "يتبع...", aboutTab: "حول",episodeTab:"الحلقات",
              Genres: "النوع:", dates:"تواريخ:", numbers:"ارقام:", general:"عام:",
              movie_runtime:"مدة الفلم", movie_hour:"ساعة و", movie_min:"دقيقة",
              cost: "التكلفة المتوقعة", first_episode:"أول حلقة", last_episode:"اخر حلقة حتى الأن",
              next_episode_to_air:"باقي على حلقة رقم", season:"للموسم", day:"يوم",
              totalEpisodes: "إجمالي عدد الحلقات:",totalSeasons: "إجمالي عدد المواسم:", tvRuntime: "مدة الحلقة الواحدة: ", discussion: "يحتاج للمناقشة"}
  }
}

export function translateBanner(){
  switch(language){
    case english:
      return {moreInfo: "More Info"}
    case arabic:
      return {moreInfo: "المزيد من المعلومات"}
  }
}