    let prev = document.querySelector('#prev'); // left button
    let next = document.querySelector('#next'); // right button
    let track = document.querySelector('#track'); 
    let count=1;//tracking slide number

    prev.addEventListener('click',shiftLeft);
    next.addEventListener('click',shiftRight);

    // making copies of first and last images
    let copyFirst = document.createElement('img');
    copyFirst.src = track.firstElementChild.src;
    let copyLast = document.createElement('img');
    copyLast.src = track.lastElementChild.src;

    // insert copy of first image at last
    track.append(copyFirst);
    // insert copy of last image at first
    track.prepend(copyLast);

    let noOfSlides = track.childElementCount;
    //console.log(noOfSlides); //here it is 6

    //disable buttons
    function disable(){
        prev.disabled = true;
        next.disabled =true;
    }

    //enable buttons
    function enable(){
        prev.disabled = false;
        next.disabled = false;
    }

    //set the slides when moved from last-->first and first--> last
    function set(){
        console.log('setfirst begin');
        if(count==0)
            count = 4;
        else
            count = 1;
        track.classList.remove('transit'); // remove transition
        track.style.transform = `translateX(${-count*100}vw)`;
        setTimeout(()=>track.classList.add('transit'),1); // add transition
        console.log('setfirst end');
        track.removeEventListener('transitionend',set);
    }

    // move to next slide
    function shiftRight(){
        disable();//disable buttons while transition
        count++; // next slide number
        //console.log(count);
        track.style.transform = `translateX(${-count*100}vw)`;
        track.addEventListener('transitionend',enable);
        if(count==noOfSlides-1)//move to right of last slide
        {
            track.addEventListener('transitionend',set);
        }
    }

    // move to previous slide
    function shiftLeft(){
        disable();//disable buttons while transition
        count--; // previous slide number
        //console.log(count);
        track.style.transform = `translateX(${-count*100}vw)`;
        track.addEventListener('transitionend',enable);
        if(count==0)//move to left of first slide
        {
            track.addEventListener('transitionend',set);
        }
    }

    // -------------------------HANDLING TOUCH EVENTS--------------------------------
    container.addEventListener('touchstart', start,{passive:true});
    container.addEventListener('touchend', end, {passive:true});

    let startX, startTime, elapsedTime, dist, allowedTime = 1000, threshold = 70;
    /*
        startX - note position where touch starts
        startTime - note start time of touch
        dist - note distance travelled
        allowedTime - upper bound of time ; time spent must not go beyond this
        threshold - distance that must be travelled by swipe
    */

    function start(e){
        var touchobj = e.touches[0]
        dist = 0
        startX = touchobj.clientX
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        console.log(startX,startTime);
    }

    function end(e){
        var touchobj = e.changedTouches[0]
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        dist = touchobj.clientX - startX // get total dist traveled by finger while in contact with surface
        console.log(dist,elapsedTime);
        if(dist>=0){
           var swiperightBol = (elapsedTime <= allowedTime && dist >= threshold)
        }
        else{
            var swipeleftBol = (elapsedTime <= allowedTime && Math.abs(dist) >= threshold)
        }
        if(swiperightBol){
            shiftLeft();
        }
        else if(swipeleftBol){
            shiftRight();
        }
    }

    // ----------------------------MAKE INITIAL CALL----------------------------------
    set();