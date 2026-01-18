const $SECURITY_MESSAGE = "Attempts limited: Multiple invalid attempts triggered a brief security delay. Please wait 5 minutes before next try. This delay prevents unauthorized access.";


/* DOM REFERENCES */
const body = document.getElementById('body');
const autoValidate = document.getElementById('toggle-frame');
const status = document.getElementById('status');
const progress = document.getElementById('main-header-indicators');
const keys = document.getElementById('main-main-key-container');
const $overlay = document.getElementById('security-alert-overlay');
const $fireWall = document.getElementById('security-alert');
const quickAccess = [$overlay, $fireWall];
const bip = document.getElementById('bip');
const grantAccess = document.getElementById('granted');

class ZeusSecuritySystem {
  constructor() {
    this.zeusPasscode = 2008051717;
    this.isAutoValidate = false;
    this.autoValidateTrack = false;
    this.updateStatTrack = false;
    this.isUnlocked = false;
    this.lockNext = false;
    this.attempts = ()=> parseInt(localStorage.getItem('_config'));
    this.maxAttempts = 3;
    this.entries = [];
    this.disableEvent = ()=> this.$disable();
    this.garbageNodes = [];
    this.getKeyStrokes();
    this.enableToggle();
    !localStorage.getItem('_fireWall')? localStorage.setItem('_fireWall','00:05:00') : null;
    !localStorage.getItem('_config')? localStorage.setItem('_config','0') : null;
    this.$$();
  }
  getKeyStrokes() {
    const buttons = keys.querySelectorAll('p');
    buttons.forEach((btn, index) => {
      btn.onclick = () => {
        switch (index.toString()) {
          case '0':
            this.validateInputs('1');
            break;
          case '1':
            this.validateInputs('2');
            break;
          case '2':
            this.validateInputs('3');
            break;
          case '3':
            this.validateInputs('4');
            break;
          case '4':
            this.validateInputs('5');
            break;
          case '5':
            this.validateInputs('6');
            break;
          case '6':
            this.validateInputs('7');
            break;
          case '7':
            this.validateInputs('8');
            break;
          case '8':
            this.validateInputs('9');
            break;
          case '9':
            this.validateInputs('\b');
            break;
          case '10':
            this.validateInputs('0');
            break;
          case '11':
            this.validateInputs('enter');
            break;
          default:
            /* pass */
        }
      }
    })
  }
  $$() {
    this.initial = setInterval(() => {
      if (this.attempts() === this.maxAttempts){
        quickAccess[0].removeEventListener('click', this.disableEvent);
        body.style.overflowY = 'hidden';
        quickAccess.forEach((ele) => ele.style.display = 'flex');
        quickAccess[1].querySelector('p').textContent = $SECURITY_MESSAGE;
        this.$_______________();
        clearInterval(this.initial);
      }
    }, 500)
  }
  validateInputs(key) {
    
    if ((this.entries.length) < 10 && key !== '\b' && key !== 'enter') {
      this.entries.push(key);
      this.updateProgress();
      this.fxKeypad('bip');
      
    } else if (key === '\b') {
      if (this.entries.length) {
        const p = progress.querySelectorAll('p');
        p[this.entries.length - 1].style.background = 'none';
        this.entries.pop();
        this.fxKeypad('bip');
      }
    }
    if (this.isAutoValidate) {
      const div = progress.querySelector('div');
      if (this.entries.length === 10 && !Boolean(this.entries.join('') === this.zeusPasscode.toString())) {
        div.style.animation = 'incorrect 1.5s ease';
        localStorage.setItem('_config',`${this.attempts() + 1}`);
        this.entries = [];
        const p = progress.querySelectorAll('p');
        p.forEach((prog) => {
          prog.style.background = 'none';
        })
        setTimeout(() => {
          div.style.animation = 'none';
        }, 1000)
        
      } else if (this.entries.length === 10 && Boolean(this.entries.join('') === this.zeusPasscode.toString())) {
        if (!this.lockNext) {
          const ent = keys.querySelectorAll('p')[11];
          ent.style.background = 'var(--red0)';
          ent.querySelector('i').className = 'fas fa-lock';
          this.isUnlocked = true;
          localStorage.setItem('_config','0');
          this.updateStat();
          this.fxKeypad('granted');
          this.lockNext = true;
          const p = progress.querySelectorAll('p');
          p.forEach((prog) => {
            prog.style.background = 'none';
          })
        } else {
          const ent = keys.querySelectorAll('p')[11];
          ent.style.background = 'var(--green0)';
          ent.querySelector('i').className = 'fas fa-unlock-keyhole';
          this.isUnlocked = false;
          this.updateStat();
          this.entries = [];
          this.lockNext = false;
        }
      }
      return;
    }
    if (key === 'enter') {
      const div = progress.querySelector('div');
      this.fxKeypad('bip');
      if (this.entries.length === 10 && !Boolean(this.entries.join('') === this.zeusPasscode.toString())) {
        div.style.animation = 'incorrect 1.5s ease';
        localStorage.setItem('_config',`${this.attempts() + 1}`);
        this.entries = [];
        const p = progress.querySelectorAll('p');
        p.forEach((prog) => {
          prog.style.background = 'none';
        })
        setTimeout(() => {
          div.style.animation = 'none';
        }, 1000)
        
      } else if (this.entries.length === 10 && Boolean(this.entries.join('') === this.zeusPasscode.toString())) {
        if (!this.lockNext) {
          const ent = keys.querySelectorAll('p')[11];
          ent.style.background = 'var(--red0)';
          ent.querySelector('i').className = 'fas fa-lock';
          this.isUnlocked = true;
          this.updateStat();
          this.fxKeypad('granted');
          this.lockNext = true;
          const p = progress.querySelectorAll('p');
          p.forEach((prog) => {
            prog.style.background = 'none';
          })
        } else {
          const ent = keys.querySelectorAll('p')[11];
          ent.style.background = 'var(--green0)';
          ent.querySelector('i').className = 'fas fa-unlock-keyhole';
          localStorage.setItem('_config','0');
          this.isUnlocked = false;
          this.updateStat();
          this.entries = [];
          this.lockNext = false;
        }
      }
    }
  }
  updateStat() {
    if (!this.updateStatTrack) {
      status.style.background = String('var(--red0)');
      status.innerHTML = String('<i class="fas fa-lock-open"></i>Unlocked');
    } else {
      status.style.background = String('var(--green0)');
      status.innerHTML = String('<i class="fas fa-lock"></i>Locked');
    }
    this.updateStatTrack = !this.updateStatTrack;
  }
  updateProgress() {
    const p = progress.querySelectorAll('p');
    p[this.entries.length - 1].style.background = 'var(--dark)';
    p[this.entries.length - 1].style.height = String('20px');
    p[this.entries.length - 1].style.width = String('20px');
    p.forEach((prog, index) => {
      if ((this.entries.length - 1) === index) {
        setTimeout(() => {
          prog.style.height = '15px';
          prog.style.width = '15px';
        }, 300)
      }
    })
  }
  fxKeypad(mode) {
    /* this.garbageNodes */
    if (mode === String('bip')) {
      this.garbageNodes.push(bip.cloneNode());
      this.garbageNodes[0].play();
      this.garbageNodes = [];
    } else if (mode === String('granted')) {
      this.garbageNodes.push(grantAccess.cloneNode());
      this.garbageNodes[0].play();
      this.garbageNodes = [];
    }
  }
  $_______________() {
    /* 00:00:00 */
    let $mins = parseInt(localStorage.getItem('_fireWall').split(':')[1]);
    let $secs = parseInt(localStorage.getItem('_fireWall').split(':')[2]);
    
    let _counter = quickAccess[1].querySelector('div');
    
    let _internal = setInterval(() => {
      if ($mins === 0 && $secs === 0) {
        clearInterval(_internal);
        this.fxKeypad('granted');
        localStorage.setItem('_config','0');
        localStorage.setItem('_fireWall', `00:05:00`);
        quickAccess[1].querySelector('span').style.background = '#B9F6CA';
        quickAccess[1].querySelector('var').style.background = '#69F0AE';
        quickAccess[1].querySelector('i').style.background = '#00E676';
        quickAccess[1].querySelector('p').textContent = 'Timeout elapsed, please try again!';
        _counter.textContent = '00:00:00';
        quickAccess[1].querySelector('i').className = 'fas fa-check-double';
        quickAccess[0].addEventListener('click', this.disableEvent);
        return;
      }
      
      if ($secs === 0) {
        $secs = 60;
        $mins--;
      }
      $secs--;
      
      localStorage.setItem('_fireWall', `00:0${$mins}:${$secs.toString().length === 1 ? '0' + $secs:$secs}`);
      _counter.textContent = localStorage.getItem('_fireWall');
    }, 1000)
  }
  enableToggle() {
    autoValidate.onclick = () => {
      if (!this.autoValidateTrack) {
        const span = autoValidate.querySelector('span');
        const p = autoValidate.querySelector('p');
        span.style.transform = 'translateX(23px)';
        p.textContent = String('Active');
        p.style.transform = 'translateX(-16px)';
        this.autoValidateTrack = true;
        this.isAutoValidate = true;
      } else {
        const span = autoValidate.querySelector('span');
        const p = autoValidate.querySelector('p');
        span.style.transform = 'translateX(-23px)';
        p.textContent = String('Off');
        p.style.transform = 'translateX(20px)';
        this.autoValidateTrack = false;
        this.isAutoValidate = false;
      }
    }
  }
  $disable() {
    body.style.overflowY = 'scroll';
    quickAccess[1].querySelector('span').style.background = '#FF8A80';
    quickAccess[1].querySelector('var').style.background = '#FF5252';
    quickAccess[1].querySelector('i').style.background = '#FF1744';
    quickAccess[1].querySelector('p').textContent = $SECURITY_MESSAGE;
    quickAccess[1].querySelector('i').className = 'fas fa-triangle-exclamation';
    quickAccess.forEach((ele) => ele.style.display = 'none');
    this.$$();
  }
}


new ZeusSecuritySystem();
