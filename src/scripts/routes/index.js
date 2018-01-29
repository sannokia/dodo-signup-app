import deferredComponent from 'react-imported-component';

export const HomePage = deferredComponent(() =>
  import(/* webpackChunkName:'home' */ '../modules/Home')
);

export const ScratchPage = deferredComponent(() =>
  import(/* webpackChunkName:'scratch' */ '../modules/Scratch')
);
