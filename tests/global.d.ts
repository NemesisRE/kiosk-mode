import sinon, { SinonSpy } from 'sinon';

declare global {
    interface Window {
        sinon: typeof sinon;
        __listener: SinonSpy;
    }
}
  
export {};