const nonce = document.currentScript?.nonce;
var WebComponents=function(m){"use strict";var Re=Object.defineProperty;var He=(m,h,x)=>h in m?Re(m,h,{enumerable:!0,configurable:!0,writable:!0,value:x}):m[h]=x;var b=(m,h,x)=>He(m,typeof h!="symbol"?h+"":h,x);function h(){}function x(t){return t()}function Y(){return Object.create(null)}function N(t){t.forEach(x)}function F(t){return typeof t=="function"}function K(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let P;function pe(t,e){return t===e?!0:(P||(P=document.createElement("a")),P.href=e,t===P.href)}function ve(t){return Object.keys(t).length===0}function r(t,e){t.appendChild(e)}function Q(t,e,n){const s=be(t);if(!s.getElementById(e)){const i=u("style");i.nonce=nonce;i.id=e,i.textContent=n,me(s,i)}}function be(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function me(t,e){return r(t.head||t,e),e.sheet}function j(t,e,n){t.insertBefore(e,n||null)}function E(t){t.parentNode&&t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function M(t){return document.createTextNode(t)}function $(){return M(" ")}function ge(){return M("")}function _e(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function a(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function xe(t){return Array.from(t.childNodes)}function ye(t,e){e=""+e,t.data!==e&&(t.data=e)}function we(t){const e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}let T;function A(t){T=t}const w=[],X=[];let z=[];const Z=[],ze=Promise.resolve();let q=!1;function ke(){q||(q=!0,ze.then(H))}function D(t){z.push(t)}const R=new Set;let k=0;function H(){if(k!==0)return;const t=T;do{try{for(;k<w.length;){const e=w[k];k++,A(e),Ce(e.$$)}}catch(e){throw w.length=0,k=0,e}for(A(null),w.length=0,k=0;X.length;)X.pop()();for(let e=0;e<z.length;e+=1){const n=z[e];R.has(n)||(R.add(n),n())}z.length=0}while(w.length);for(;Z.length;)Z.pop()();q=!1,R.clear(),A(t)}function Ce(t){if(t.fragment!==null){t.update(),N(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(D)}}function Ee(t){const e=[],n=[];z.forEach(s=>t.indexOf(s)===-1?e.push(s):n.push(s)),n.forEach(s=>s()),z=e}const Ae=new Set;function Se(t,e){t&&t.i&&(Ae.delete(t),t.i(e))}function Oe(t,e,n){const{fragment:s,after_update:i}=t.$$;s&&s.m(e,n),D(()=>{const o=t.$$.on_mount.map(x).filter(F);t.$$.on_destroy?t.$$.on_destroy.push(...o):N(o),t.$$.on_mount=[]}),i.forEach(D)}function Le(t,e){const n=t.$$;n.fragment!==null&&(Ee(n.after_update),N(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ne(t,e){t.$$.dirty[0]===-1&&(w.push(t),ke(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ee(t,e,n,s,i,o,c=null,d=[-1]){const f=T;A(t);const l=t.$$={fragment:null,ctx:[],props:o,update:h,not_equal:i,bound:Y(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(f?f.$$.context:[])),callbacks:Y(),dirty:d,skip_bound:!1,root:e.target||f.$$.root};c&&c(l.root);let p=!1;if(l.ctx=n?n(t,e.props||{},(v,g,...y)=>{const _=y.length?y[0]:g;return l.ctx&&i(l.ctx[v],l.ctx[v]=_)&&(!l.skip_bound&&l.bound[v]&&l.bound[v](_),p&&Ne(t,v)),g}):[],l.update(),p=!0,N(l.before_update),l.fragment=s?s(l.ctx):!1,e.target){if(e.hydrate){const v=xe(e.target);l.fragment&&l.fragment.l(v),v.forEach(E)}else l.fragment&&l.fragment.c();e.intro&&Se(t.$$.fragment),Oe(t,e.target,e.anchor),H()}A(f)}let te;typeof HTMLElement=="function"&&(te=class extends HTMLElement{constructor(e,n,s){super();b(this,"$$ctor");b(this,"$$s");b(this,"$$c");b(this,"$$cn",!1);b(this,"$$d",{});b(this,"$$r",!1);b(this,"$$p_d",{});b(this,"$$l",{});b(this,"$$l_u",new Map);this.$$ctor=e,this.$$s=n,s&&this.attachShadow({mode:"open"})}addEventListener(e,n,s){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(n),this.$$c){const i=this.$$c.$on(e,n);this.$$l_u.set(n,i)}super.addEventListener(e,n,s)}removeEventListener(e,n,s){if(super.removeEventListener(e,n,s),this.$$c){const i=this.$$l_u.get(n);i&&(i(),this.$$l_u.delete(n))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(o){return()=>{let c;return{c:function(){c=u("slot"),o!=="default"&&a(c,"name",o)},m:function(l,p){j(l,c,p)},d:function(l){l&&E(c)}}}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;const n={},s=we(this);for(const o of this.$$s)o in s&&(n[o]=[e(o)]);for(const o of this.attributes){const c=this.$$g_p(o.name);c in this.$$d||(this.$$d[c]=B(c,o.value,this.$$p_d,"toProp"))}for(const o in this.$$p_d)!(o in this.$$d)&&this[o]!==void 0&&(this.$$d[o]=this[o],delete this[o]);this.$$c=new this.$$ctor({target:this.shadowRoot||this,props:{...this.$$d,$$slots:n,$$scope:{ctx:[]}}});const i=()=>{this.$$r=!0;for(const o in this.$$p_d)if(this.$$d[o]=this.$$c.$$.ctx[this.$$c.$$.props[o]],this.$$p_d[o].reflect){const c=B(o,this.$$d[o],this.$$p_d,"toAttribute");c==null?this.removeAttribute(this.$$p_d[o].attribute||o):this.setAttribute(this.$$p_d[o].attribute||o,c)}this.$$r=!1};this.$$c.$$.after_update.push(i),i();for(const o in this.$$l)for(const c of this.$$l[o]){const d=this.$$c.$on(o,c);this.$$l_u.set(c,d)}this.$$l={}}}attributeChangedCallback(e,n,s){var i;this.$$r||(e=this.$$g_p(e),this.$$d[e]=B(e,s,this.$$p_d,"toProp"),(i=this.$$c)==null||i.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$c=void 0)})}$$g_p(e){return Object.keys(this.$$p_d).find(n=>this.$$p_d[n].attribute===e||!this.$$p_d[n].attribute&&n.toLowerCase()===e)||e}});function B(t,e,n,s){var o;const i=(o=n[t])==null?void 0:o.type;if(e=i==="Boolean"&&typeof e!="boolean"?e!=null:e,!s||!n[t])return e;if(s==="toAttribute")switch(i){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(i){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function ne(t,e,n,s,i,o){let c=class extends te{constructor(){super(t,n,i),this.$$p_d=e}static get observedAttributes(){return Object.keys(e).map(d=>(e[d].attribute||d).toLowerCase())}};return Object.keys(e).forEach(d=>{Object.defineProperty(c.prototype,d,{get(){return this.$$c&&d in this.$$c?this.$$c[d]:this.$$d[d]},set(f){var l;f=B(d,f,e),this.$$d[d]=f,(l=this.$$c)==null||l.$set({[d]:f})}})}),s.forEach(d=>{Object.defineProperty(c.prototype,d,{get(){var f;return(f=this.$$c)==null?void 0:f[d]}})}),t.element=c,c}class se{constructor(){b(this,"$$");b(this,"$$set")}$destroy(){Le(this,1),this.$destroy=h}$on(e,n){if(!F(n))return h;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const i=s.indexOf(n);i!==-1&&s.splice(i,1)}}$set(e){this.$$set&&!ve(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const Pe="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Pe);function je(t){Q(t,"svelte-11h5bbz",'@media(min-width: 576px){}@media(min-width: 576px){}.conteneur-navigation-pied-de-page.svelte-11h5bbz.svelte-11h5bbz{font-family:"Marianne";list-style:none;display:flex;flex-direction:row;align-items:end;row-gap:16px;column-gap:8px;margin:0 16px;padding:16px 0;flex-wrap:wrap;border-top:1px solid #dddddd}@media(min-width: 932px){.conteneur-navigation-pied-de-page.svelte-11h5bbz.svelte-11h5bbz{margin:0 24px;column-gap:16px}}.conteneur-navigation-pied-de-page.svelte-11h5bbz a.svelte-11h5bbz{color:#666666;text-decoration:none;font-size:12px;font-style:normal;font-weight:400;line-height:20px;white-space:nowrap}.conteneur-navigation-pied-de-page.svelte-11h5bbz a.svelte-11h5bbz:hover{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:4px}.conteneur-navigation-pied-de-page.svelte-11h5bbz a.svelte-11h5bbz:active{background:#ededed}.separateur.svelte-11h5bbz.svelte-11h5bbz{width:1px;height:16px;background:#dddddd}')}function Me(t){let e,n,s,i,o,c,d,f,l,p,v,g,y,_,ae,J,ce,S,de,V,ue,O,fe,G,he,C,$e,I=t[0]==="conforme"?"conforme":"non conforme",U;return{c(){e=u("div"),n=u("a"),n.textContent="À propos",s=$(),i=u("div"),o=$(),c=u("a"),c.textContent="Mentions légales",d=$(),f=u("div"),l=$(),p=u("a"),p.textContent="Politique de confidentialité",v=$(),g=u("div"),y=$(),_=u("a"),_.textContent="Conditions générales",ae=$(),J=u("div"),ce=$(),S=u("a"),S.textContent="Statistiques d’utilisation",de=$(),V=u("div"),ue=$(),O=u("a"),O.textContent="Sécurité",fe=$(),G=u("div"),he=$(),C=u("a"),$e=M("Accessiblité: "),U=M(I),a(n,"href","/aPropos"),a(n,"class","svelte-11h5bbz"),a(i,"class","separateur svelte-11h5bbz"),a(c,"href","/mentionsLegales"),a(c,"class","svelte-11h5bbz"),a(f,"class","separateur svelte-11h5bbz"),a(p,"href","/confidentialite"),a(p,"class","svelte-11h5bbz"),a(g,"class","separateur svelte-11h5bbz"),a(_,"href","/cgu"),a(_,"class","svelte-11h5bbz"),a(J,"class","separateur svelte-11h5bbz"),a(S,"href","/statistiques"),a(S,"class","svelte-11h5bbz"),a(V,"class","separateur svelte-11h5bbz"),a(O,"href","/securite"),a(O,"class","svelte-11h5bbz"),a(G,"class","separateur svelte-11h5bbz"),a(C,"href","/accessibilite"),a(C,"class","svelte-11h5bbz"),a(e,"class","conteneur-navigation-pied-de-page svelte-11h5bbz")},m(L,W){j(L,e,W),r(e,n),r(e,s),r(e,i),r(e,o),r(e,c),r(e,d),r(e,f),r(e,l),r(e,p),r(e,v),r(e,g),r(e,y),r(e,_),r(e,ae),r(e,J),r(e,ce),r(e,S),r(e,de),r(e,V),r(e,ue),r(e,O),r(e,fe),r(e,G),r(e,he),r(e,C),r(C,$e),r(C,U)},p(L,[W]){W&1&&I!==(I=L[0]==="conforme"?"conforme":"non conforme")&&ye(U,I)},i:h,o:h,d(L){L&&E(e)}}}function Be(t,e,n){let{conformiteAccessibilite:s="conforme"}=e;return t.$$set=i=>{"conformiteAccessibilite"in i&&n(0,s=i.conformiteAccessibilite)},[s]}class ie extends se{constructor(e){super(),ee(this,e,Be,Me,K,{conformiteAccessibilite:0},je)}get conformiteAccessibilite(){return this.$$.ctx[0]}set conformiteAccessibilite(e){this.$$set({conformiteAccessibilite:e}),H()}}customElements.define("lab-anssi-navigation-pied-de-page",ne(ie,{conformiteAccessibilite:{}},[],[],!0));const Ie=t=>`https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com${t}`;function Te(t){Q(t,"svelte-1vdfn4o",'.visible-tablette.svelte-1vdfn4o.svelte-1vdfn4o{display:none !important}@media(min-width: 576px){.visible-tablette.svelte-1vdfn4o.svelte-1vdfn4o{display:unset !important}}@media(min-width: 576px){}.largeur-totale.svelte-1vdfn4o.svelte-1vdfn4o{position:relative;overflow:hidden;background:#0d0c21 url("https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com/illustrations/tuile-msc.svg");background-size:500px}.largeur-totale.svelte-1vdfn4o .contenu.svelte-1vdfn4o{position:relative;color:white;font-family:"Marianne";padding:16px;max-width:1200px;margin:auto;font-size:0.875rem;line-height:1.5rem;display:flex;flex-direction:column}@media(min-width: 932px){.largeur-totale.svelte-1vdfn4o .contenu.svelte-1vdfn4o{flex-direction:row;gap:16px;align-items:center}}.largeur-totale.svelte-1vdfn4o .contenu .fermer.svelte-1vdfn4o{border:none;cursor:pointer;background:none;padding:0;transition:transform 0.2s ease-in-out;position:absolute;top:20px;right:20px}.largeur-totale.svelte-1vdfn4o .contenu .fermer.svelte-1vdfn4o:hover{transform:scale(1.3)}.largeur-totale.svelte-1vdfn4o .contenu .textes.svelte-1vdfn4o{display:flex;flex-direction:column}@media(min-width: 576px){.largeur-totale.svelte-1vdfn4o .contenu .textes.svelte-1vdfn4o{gap:8px}}.largeur-totale.svelte-1vdfn4o .contenu h4.svelte-1vdfn4o{font-size:0.875rem;line-height:1.5rem;font-weight:700;margin:0;display:flex;flex-direction:row;align-items:baseline;gap:8px}@media(min-width: 932px){.largeur-totale.svelte-1vdfn4o .contenu h4.svelte-1vdfn4o{font-size:1rem;line-height:1.5rem}}.largeur-totale.svelte-1vdfn4o .contenu h4 .badge.svelte-1vdfn4o{color:#19753c;background:#b8fec9;border-radius:4px;padding-right:6px;padding-left:6px;font-size:0.75rem;font-weight:700;line-height:1.25rem;text-transform:uppercase;transform:translateY(-3px)}.largeur-totale.svelte-1vdfn4o .contenu p.svelte-1vdfn4o{font-weight:400;font-size:0.875rem;line-height:1.5rem;margin:0;padding-right:32px}@media(min-width: 932px){.largeur-totale.svelte-1vdfn4o .contenu p.svelte-1vdfn4o{font-size:1rem;line-height:1.5rem}}.largeur-totale.svelte-1vdfn4o .contenu a.svelte-1vdfn4o{display:block;color:#242424;background:white;margin:8px auto 0 0;text-align:center;font-size:0.875rem;line-height:1.5rem;text-decoration:none;gap:8px;border-radius:4px;padding:4px 12px;white-space:nowrap;height:fit-content;width:100%;max-width:312px;box-sizing:border-box}@media(min-width: 576px){.largeur-totale.svelte-1vdfn4o .contenu a.svelte-1vdfn4o{max-width:248px}}@media(min-width: 932px){.largeur-totale.svelte-1vdfn4o .contenu a.svelte-1vdfn4o{margin-right:32px}}')}function oe(t){let e,n,s,i,o,c,d,f,l,p,v;return{c(){e=u("div"),n=u("div"),s=u("button"),i=u("img"),c=$(),d=u("div"),d.innerHTML=`<h4 class="svelte-1vdfn4o">🚀 Découvrez MesServicesCyber ! <span class="badge visible-tablette svelte-1vdfn4o">nouveauté</span></h4> <p class="svelte-1vdfn4o">MesServicesCyber, la plateforme pour faciliter l&#39;accès aux services et ressources de
          l&#39;ANSSI et de ses partenaires.</p>`,f=$(),l=u("a"),l.textContent="Je découvre MesServicesCyber",pe(i.src,o=t[1])||a(i,"src",o),a(i,"alt","fermer"),a(s,"class","fermer svelte-1vdfn4o"),a(d,"class","textes svelte-1vdfn4o"),a(l,"href","https://messervices.cyber.gouv.fr/"),a(l,"target","_blank"),a(l,"rel","noopener"),a(l,"id","matomo-bandeau-promotion-msc"),a(l,"class","svelte-1vdfn4o"),a(n,"class","contenu svelte-1vdfn4o"),a(e,"class","largeur-totale svelte-1vdfn4o")},m(g,y){j(g,e,y),r(e,n),r(n,s),r(s,i),r(n,c),r(n,d),r(n,f),r(n,l),p||(v=_e(s,"click",t[2]),p=!0)},p:h,d(g){g&&E(e),p=!1,v()}}}function qe(t){let e,n=t[0]==="visible"&&oe(t);return{c(){n&&n.c(),e=ge()},m(s,i){n&&n.m(s,i),j(s,e,i)},p(s,[i]){s[0]==="visible"?n?n.p(s,i):(n=oe(s),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},i:h,o:h,d(s){s&&E(e),n&&n.d(s)}}}const re="lab-anssi-ui-kit-msc-bandeau-affichage";function De(t,e,n){let s=localStorage.getItem(re)||"visible";const i=Ie("/icones/croix-blanche.svg");return[s,i,()=>{n(0,s="invisible"),localStorage.setItem(re,"invisible")}]}class le extends se{constructor(e){super(),ee(this,e,De,qe,K,{},Te)}}return customElements.define("lab-anssi-mes-services-cyber-bandeau",ne(le,{},[],[],!0)),m.MesServicesCyberBandeau=le,m.NavigationPiedDePage=ie,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"}),m}({});
