<script>
    import { noop } from "svelte/internal";

    let navigationVisible = false;
    let imageScaled = false;

function toggleImageScale() {
    imageScaled = !imageScaled;
    navigationVisible = !navigationVisible;
}


</script>
<main>
    <header>
        <div class="logo">
            <span>gugut</span>
            <span>podcast</span>
        </div>
        <div class="detail">
            <img src="nav.png" alt="" class="{imageScaled ? 'scaled' : ''}" on:click={toggleImageScale}>
            <div class="navigation {navigationVisible ? 'visible' : ''}">
              <a href=""><li>about us</li></a>
              <a href=""><li>giveaway</li></a>
              <a href=""><li>inquiries</li></a>
            </div>
          </div>
    </header>
    <section>
        <div class="firstsection">
            <div class="firsttext">
                <h1>Thought-Provoking Conversations and Entertaining Stories</h1>
                <p>Gugut is an entertainment/educational podcast focused on discussing different perspectives on philosophy and the day-to-day lives of everyday people.</p>
                <button>Start Listening</button>
                <img src="anchor-hero.svg" alt="anchor">
                <img src="yt-hero.svg" alt="anchor">
            </div>
            <div class="circle">
                <div class="circlee">
                    <img src="logo.svg"  alt="logo">
                </div>
            </div>
            <div></div>
        </div>
    </section>
    <div class="secondsection">
        <a href=""><img src="spotify.svg" alt=""></a>
        <a href=""><img src="google-podcast.svg" alt=""></a>
        <a href=""><img src="apple-podcast.svg" alt=""></a>
        <a href=""><img src="teraki.svg" alt=""></a>
    </div>
    <div class="fosection">
        
       
        <div class="image-with-gradient">
            <img src="fin.jpeg" alt="thumb" width="100%">
          </div>
    <div class="inside">
        <a href=""><img src="play.svg" alt=""></a>
        <span>Latest episode</span>
        <h1>በራስ ሰዐት መስራት፤ online ማስተማር እና Freelancing | ከቃልኪዳን ጋር የተደረገ ቆይታ</h1>
        <p>In this episode, we chat with Kalkidan, a software developer, Udemy instructor, and remote work expert. Kalkidan's story is one of determination and hustle. She</p>
        <a href="">See episode</a>
    </div>
 </div>
    <div class="finalsection">
        <div class="more">
            <h1>More episodes</h1>
            <a href=""><p>View</p></a>
        </div>
        <div class="thumbn">
            <div class="info">
                <img class="bannerth" src="maxresdefault.jpg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>

            <div class="info">
                <img class="bannerth" src="th1.jpeg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>
            <div class="info">
                <img class="bannerth" src="th2.jpeg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>
            <div class="info">
                <img class="bannerth" src="th3.jpeg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>
            <div class="info">
                <img class="bannerth" src="th4.jpeg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>
            <div class="info">
                <img class="bannerth" src="th5.jpeg" alt="">
                <h1>በጋራ ንብረት ያፍሩ | ከ ታምራት አበራ ጋር የተደረገ</h1>
                <div class="amistart">
                    <div class="maker"><img src="episode-play.svg" alt="episode-paly" width="16px"><span>Play this episode</span></div>
                    <span class="yetersa" style="color: rgba(255, 255, 255, 0.6)">04 Mar /23</span>
                </div>
            </div>
        </div>
        <br><br> <br><br> <br>
        <div class="morn">
            <h1>Audio</h1>
            <a href=""><p>View</p></a>
        </div>
        <div class="audio">
            <div class="alls">
                <img src="play.svg" alt="play icon">
                <div class="allstext">
                    <div class="ps">
                        <p class="isover">EP#140 "ከ12 አቁሜ ስዕል ጀመርኩ" : ሙዚቃ Tibebu</p>
                        <p class="lasts">February 26 2024</p>
                    </div>
                    <p class="guro">Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday</p>
                </div>
            </div>
            <div class="hr"></div>
            <div class="alls">
                <img src="play.svg" alt="play icon">
                <div class="allstext">
                    <div class="ps">
                        <p class="isover">EP 145 "ከ12 አቁሜ ስዕል ጀመርኩ" : ሙዚቃ ቪዲዮ ፕሮዲውሰር እና የፋሽን ብራንድ ዲዛይነር | Kirubel Tibebu</p>
                        <p class="lasts">February 26 2024</p>
                    </div>
                    <p class="guro">Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday</p>
                </div>
            </div>
            <div class="hr"></div>
            <div class="alls">
                <img src="play.svg" alt="play icon">
                <div class="allstext">
                    <div class="ps">
                        <p class="isover">ስዕል ጀመርኩ" : ሙዚቃ ቪዲዮ ፕሮዲውሰር እና የፋሽን ብራንድ ዲዛይነር | Kirubel Tibebu</p>
                        <p class="lasts">February 26 2024</p>
                    </div>
                    <p class="guro">Gugut is an entertainment/educational podcast which is focused on discussing different perspectives on technology, philosophy and day-to-day lives of everyday</p>
                </div>
            </div>
            <div class="hr"></div>
            <br><br><br><br><br><br><br><br>
        </div>
        </div>
        
    <footer>
        <div class="contact">
            <div class="iconnav">
                <div class="icons">
                    <a href="https://www.facebook.com/profile.php?id=100094580416767"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="fill-current"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"></path></svg></a>
                    <a href="https://x.com/gugutpodcast"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="fill-current"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"></path></svg></a>
                    <a href="https://instagram.com/gugutpodcast"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="fill-current"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"></path></svg></a>
                    <a href="https://youtube.com/c/@gugutpodcast"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="fill-current"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"></path></svg></a>
                    <a href="https://tiktok.com/gugutpodcast"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="fill-current"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"></path></svg></a>
                </div>
                <div class="nav">
                    <a href=""><li>home</li></a>
                    <a href=""><li>about us</li></a>
                    <a href=""><li>giveaway</li></a>
                    <a href=""><li>Feedback</li></a>
                </div>
            </div>
        </div>
        
        <div class="design">
            <p>© 2023 Gugut Podcast. All rights reserved.</p>
            <p>Website designed by <a href="">Yonathan Dejene</a></p>
        </div>
    </footer>
    <style>
        a{
    text-decoration: none;
  }
	main {

	}
    header{
        width: 100%;
        backdrop-filter: blur(13px);
        height: 80px;
        padding: 0;
        background-color: #1e1e1ec1;
        margin: 0;
        display: block;
        position: fixed;
        z-index: 99;
        box-shadow: 0 0 10px rgba(0, 0, 3, 0.5);
    }
    .logo{
        text-transform: uppercase;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-weight: 700;
        padding-left: 113px;
        margin-top: 26px;
        font-size: 20px;
        position: absolute; 
    }
    .logo span{
       left: 3%;
       cursor: pointer;
    }
    .logo span:first-child{
        color: #f39b35;
    }
    .logo span:last-child{
        color: #289fed;

    }
    .detail img{
        display: none;
    }
    .detail{
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: block;
    }
    .navigation{
        height: 100%;
        justify-content: center;
        display: flex;
        text-align: center;
    }
    
   .navigation.visible {
        display: grid;
        transition: .5s;
      }
    
      .scaled {
        transition: .5s;
        transform: scale(-1.3);
      }
    .navigation a{
        height: 100%;
        display: table;
        float: left;
        text-decoration: none;
        padding: 0 20px;
    }
    .navigation a li{
        color: rgb(207, 207, 207);
        padding: 0 40px;
        display: table-cell;
        text-transform: uppercase;
        vertical-align: middle;
        font-weight: 600;
        height: 100%;
        transition: .3s;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 15px;
    }
    .navigation a li:hover{
        color: white;
        scale: 107%;
    }
    .firstsection{
        display: flex;
        justify-content: space-between;
        background-color: #1e1e1e;
        height: 718px;
        padding-right: 113px;
        padding-left: 113px;
        align-items: center;  
    }
    .firsttext{
        position: relative;
        z-index: 1;
        height: 718px;
        margin-bottom: 20px;
    }
    .firsttext h1{
        width: 470px;
        font-size: 51px;
        margin-top: 150px; 
    }
    .firsttext p{
        font-size: 15px;
        width: 540px;
        margin-bottom: 70px;
    }
    .firsttext button{
        display: flex;
        width: 160px;
        border: none;
        border-radius: 20px;
        height: 45px;
        color: white;
        text-align: center;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        background-color: #ee7306;
        margin-bottom: 70px;
        transition: .2s;
    }
    .firsttext button:hover{
        scale: 110%;
        transition: .5s;
        background-color: #0d8ce1;
        color: black;
        font-size: 17px;
    }
    .firsttext img{
        margin: 0 10px;
    }
    .firsttext img:first-child{
        width: 100px;
    }
    .circle {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 30%;
        height: 715px;
        position: relative;
    }
    .circlee {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        box-shadow:  0 0 90px 50px rgb(255, 162, 0);
        margin: auto;
    }
    .circle img{
        position: relative;
        right: 10px;
    }
    .secondsection{
        align-items: center;
        height: 280px;
        background-color: #2d2d2d;
        display: grid;
        place-items: center;
        justify-content: flex-end;
	    grid-template-columns: repeat(auto-fit, minmax(400px, 5fr));
    }
    .secondsection img{
      width: auto; 
    }
    .image-with-gradient {
        position: relative;
      }
      
      .image-with-gradient::after {
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to left, rgba(132, 132, 132, 0.028), rgba(0, 0, 0, 0.9));
        opacity: .95;
      }
    .inside{
        padding-left: 113px;
        padding-right: 113px;
        bottom: -785px;
        position: absolute;
    }
    .inside h1{
       font-size: 37px;
       width: 40%;
       
    }
    .inside p{
        color: rgba(255, 255, 255, 0.678);
        font-weight: 200;
        font-size: 17px;
        line-height: 1.7;
        letter-spacing: 0.02em;
        width: 32%;
    }
    .inside a:hover{
        letter-spacing: 0.05em;
    }
    .inside a{
        font-size: 17px;
        text-transform: capitalize;
        text-decoration: underline;
        font-weight: 200;
        color: rgba(255, 255, 255, 0.857);
    }
    .inside img{
        position: absolute;
        left: 49%;
        top: 1px;
    }
    .inside img:hover{
        scale: 105%;
    }
    .inside span{
        color: #f39b35;
        text-transform: uppercase;
        font-size: 15px;
        font-weight: 600;
        text-align: start;
    }
    .finalsection{
        padding-right: 113px;
        padding-left: 113px;
        height: auto;
        background-color: #1e1e1e;
    }
    .more{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .morn{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .morn h1{
        font-weight: 400;
    }
    .morn a{
        color: #f39b35;
        text-decoration: underline;
    }
    .more a{
        color: #f39b35;
        text-decoration: underline;
    }
    .thumbn{
        display: grid;
	    grid-template-columns: repeat(auto-fit, minmax(30%, 5fr));
	    grid-column-gap: 15px;
	    grid-row-gap: 30px;
	    margin-top: 15px;
    }
    .bannerth{
        width: 100%;
        border-radius: 15px;
        transition: .2s;
    }
    .maker{
        display: flex;
        align-items: stretch;
    }
    .maker img{
        padding-left: 0px;
    }
    .yetersa{
        font-weight: 200;
    }
    .maker span{
        padding-left: 10px;
        font-size: 17px;
        color: #f39b35;
        text-transform: capitalize;
    }
    .maker span:hover{
        text-decoration: underline;
    }
    .thumbn img:hover{
        scale: 104%;
        color: rgba(255, 255, 255, 0.6);
    }
    .amistart{
        margin-top: 16px;
        padding-left: 8px;
        display: flex;
        justify-content: space-between;
    }
    .info{
        align-items: flex-start;
	    margin-top: 7px;
    }
    .info h1{
        overflow-y: hidden;
        font-size: 18px;
        line-height: 28px;
        transition: .5s;
    }
    .info h1:hover{
        scale: 105%;
        text-decoration: underline;
    }
    .alls{
       display: flex;
       align-items: center;
    }
    .alls img{
        width: 80px;
        border-radius: 9999px;
        cursor: pointer;
    }
    .alls img:hover{
        scale: 105%;
        transition: .3s;
    }
    .allstext{
        flex: 1 1 0%;
        overflow-x: auto;
        margin-left: 32px;  
    }
    .ps{
        justify-content: space-between;
        margin: 10px 0;
        display: flex;
    }
    .lasts{
        color: rgba(255, 255, 255, 0.60);
        font-weight: 100;
        font-size: 18px;
    }
    .isover{
        letter-spacing: 0.025em;
        font-size: 21px;
        color: white;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        width: 50%;
    }
    .guro{
        overflow: hidden;
        font-weight: 200;
        width: 50%;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.60);
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 1.625;
    }
    .hr{
        height: 1px;
        background-color: white;
        width: 100%;
        margin-bottom: -24px;
    }
    .contact{
        background-color: #292929;
        color: white;
        width: 100%;
    }
    .iconnav{
        padding-top: 2.5rem; 
        padding-bottom: 2.5rem; 
        display: flex;
        gap: 1rem; 
        align-items: center;
        flex-direction: column;
    }
    .icons a{
        color: white;
       margin: 0 5px;
    }
    
    .nav{
        justify-content: center;
        display: flex;
        text-align: center;
    }
    
    
    .nav a li{
        color: rgb(184, 184, 184);
        padding: 0 10px;
        display: table-cell;
        text-transform: capitalize;
        font-size: 15px;
    }
    .nav a li:hover{
        color: rgb(225, 165, 0);
        text-decoration: underline;
        scale: 107%;
    }
    .design{
        background-color: #242424;
        display: flex;
        align-items: center;
        color: #797979;
        flex-direction: column;
    }
    .design p{
        margin: 6px 50px;
        font-size: 14px;
    }
    .design a{
        color: rgb(204, 133, 1);
        text-decoration: underline;
    }
	@media (min-width: 640px) {
		main {
			
		}
	}
    @media (max-width: 1024px) {
		
        .logo{
        padding-left: 80px;
        margin-top: 30px;
        font-size: 17px;
        }
        .navigation a li{
            padding: 0 30px;
            font-size: 13px;
	}.firstsection{
        padding-right: 80px;
        padding-left: 80px; 
    }.firsttext h1{
        font-size: 37px;
        margin-top: 150px;
    }.firsttext p{
        font-size: 14px;
        width: 350px;
        letter-spacing: 0.02em;
    }  .circle {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 30%;
        height: 715px;
        position: relative;
    }
    .circlee {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        box-shadow:  0 0 90px 40px rgb(255, 162, 0);
        margin: auto;
    }
    .circle img{
        position: relative;
        width: 290px;
        right: 2px;
    }.gradient{ 
        width: 100%;
        position: absolute;
        background-image: linear-gradient(to left, rgba(255, 255, 255, 0.007), black);
        height: 68%;
        opacity: .9;
    } .inside{
        padding-left: 80px;
        padding-right: 80px;
        bottom: 0px;
        margin: 40px 0px;
        background-color: #1e1e1e;
        position: relative;
    }
    .inside h1{
        font-size: 32px;
        width: 100%;
     }
     .inside p{
         width: 100%;
     }
     .inside img{
         position: absolute;
         left: 45%;
         top: -380px;
     }
     .image-with-gradient::after {
        height: 99.5%;
      }
      .finalsection{
        padding-right: 80px;
        padding-left: 80px;
    }
    .maker span{
        font-size: 12px;
    }
    .info h1{
        font-size: 14px;
    }.yetersa{
        font-weight: 200;
        font-size: 13px;
    }.maker img{
        padding-left: 0px;
        width: 10px;
    }
}@media (max-width: 900px) {
    .logo{
        padding-left: 65px;
        font-size: 16px;
        }.firstsection{
            padding-right: 65px;
            padding-left: 65px; 
        }
        .firsttext h1{
            font-size: 33px;
        }
        .detail img{
            display: block;
            position: absolute;
            width: 30px;
            left: 88%;
            top: 30%;
        }
        .navigation{
            height: 200px;
            justify-content: center;
            display: none;
            margin-left: 67%;
            width: 230px;
            border-radius: 8px;
            margin-top: 90px;
            background-color: #333333;
            text-align: center;
        }
        .navigation a{
            display: block;
            float: none;
            padding: 10px 0;
            height: auto;
            opacity: 86%;
        }
        .inside{
            padding-left: 65px;
            padding-right: 65px;
        }
        .finalsection{
            padding-left: 65px;
            padding-right: 65px;
        }
        .inside h1{
            font-size: 25px;
        }
        .more h1{
            font-weight: 300;
            font-size: 27px;
        }
        .morn h1{
            font-weight: 400;
            font-size: 25px;
        }
        .morn a{
            font-size: 15px;
        }
        .more a{
            font-size: 15px;
        }.thumbn{
            grid-template-columns: repeat(auto-fit, minmax(40%, 5fr));
        }.maker span{
            font-size: 17px;
        }
        .info h1{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        line-height: 1.625;
            font-size: 18px;
        }.yetersa{
            font-size: 15px;
        }.maker img{
            width: 17px;
        }
        .circle {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 30%;
            height: 715px;
            position: relative;
        }
        .circlee {
            width: 240px;
            height: 240px;
            border-radius: 50%;
            box-shadow:  0 0 110px 30px rgb(255, 162, 0);
            margin: auto;
        }
        .circle img{
            position: relative;
            width: 250px;
            right: 1px;
        }
    }@media (max-width: 767px){
        .firstsection{
            height: 958px;
            padding-right: 65px;
            padding-left: 65px;
            justify-content: center;
            align-items: center;  
        }
        .firsttext{
            position: absolute;
            top: 320px;    
            height: 718px;
            margin-bottom: 20px;
        }
        .firsttext h1{
            width: 80%;
            font-size: 32px;
            padding-left: 65px;
            padding-right: 65px;
            margin-bottom: 50px;
        }
        .firsttext p{
            width: 80%;
            padding-left: 65px;
            padding-right: 65px;
        }
        .firsttext button{
            width: 300px;
            margin-left: 70px;
            border-radius: 30px;
        }
        .firsttext img{
            margin: 0 0px;
            padding-left: 65px;
        }
        .firsttext img:first-child{
            width: 100px;
        }
        .circle {
            display: flex;
            justify-content: start;
            height: 15px;
            position: absolute;
            left: 18%;
            bottom: 80%;
        } .circlee {
             
        }
    }@media (max-width: 640px) {
        .logo{
            padding-left: 32px;
        }
        .firsttext h1{
            width: 87%;
            font-size: 30px;
            padding-left: 32px;
            padding-right: 0;
        }
        .firsttext p{
            width: 90%;
            padding-left: 32px;
            padding-right: 0;
        }.firsttext button{
            width: 90%;
            margin-left: 32px;
            margin-right: 32px;
            border-radius: 30px;
        }.firsttext img{
            margin: 0 0px;
            padding-left: 35px;
        }.secondsection{
            height: 550px;
            padding-top: 30px;
            padding-bottom: 30px;
            grid-template-columns: repeat(auto-fit, minmax(400px, 4fr));
        }.inside{
            padding-left: 35px;
            padding-right: 35px;
        }
        .finalsection{
            padding-left: 35px;
            padding-right: 35px;
        }.inside img{
            position: absolute;
            left: 45%;
            width: 65px;
            top: -250px;
        }.thumbn{
            grid-template-columns: repeat(auto-fit, minmax(50%, 5fr));
        }.maker span{
            font-size: 13px;
        }
        .yetersa{
            font-size: 13px;
        }.maker img{
            width: 10px;
        }.ps{
            justify-content: center;
            margin: 10px 0;
            display: grid;
        }.lasts{
            color: rgba(255, 255, 255, 0.60);
            font-weight: 100;
            font-size: 18px;
            margin: 0 0;
        }.isover{
            letter-spacing: 0.025em;
            font-size: 19px;
            width: 100%;
        }.allstext{
            margin-left: 22px;  
        }.guro{
            overflow: hidden;
            font-weight: 200;
            width: 100%;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.60);
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-height: 1.625;
        }
        .navigation{
            position: relative;
            right: 80px;
            width: 200px;
        }
        .hr{
            height: 1px;
            background-color: white;
            width: 100%;
            margin-bottom: -24px;
        }
    }
    </style>
</main>