import React from 'react';
import { BatteryFull, CalendarDays, Coffee, Heart, House, PieChart, ShoppingBag, Smartphone, Wallet } from 'lucide-react';
import { useLanguage } from './i18n';

// Interface concepts for the portfolio cards, using fictional demonstration values.
export default function MobilePreview({ project }) {
  const { t, language } = useLanguage();
  const finance = project === 'talumi';
  const money = value => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

  return <div className={`android-preview ${finance ? 'android-finance' : 'android-coffee'}`}>
    <div className="android-phone">
      <div className="android-status"><span>9:41</span><span className="android-camera" /><BatteryFull size={12} /></div>
      <div className="android-app-brand">{finance ? <Wallet size={15} /> : <Coffee size={15} />}<b>{finance ? 'Talumi' : 'CoffeeDev'}</b></div>
      {finance ? <>
        <div className="android-balance"><span>{t('Saldo disponível')}</span><b>{money(3250)}</b></div>
        <div className="android-tabs"><span>{t('Finanças')}</span><span>{t('Investimentos')}</span></div>
        <div className="android-report"><span>{t('Relatório mensal')}</span><div className="android-chart"><i /><i /><i /><i /><i /><i /></div></div>
        <div className="android-transaction"><span>{t('Receitas')}</span><b>+ {money(4800)}</b></div>
        <div className="android-transaction"><span>{t('Despesas')}</span><b>− {money(1550)}</b></div>
      </> : <>
        <div className="android-greeting">{t('Uma pausa para o café.')}</div>
        <div className="android-coffee-card"><Heart size={10} className="android-heart" /><Coffee size={53} strokeWidth={1.2} /><b>Cappuccino</b><span>{t('Seu próximo favorito.')}</span></div>
        <div className="android-order"><span>{t('Seu pedido')}</span><b>{t('Em preparo')}</b></div>
        <div className="android-order-progress"><i /><i /><i /></div>
      </>}
      <div className="android-bottom-nav">{finance ? <><Wallet size={13} /><CalendarDays size={13} /><PieChart size={13} /></> : <><House size={13} /><Heart size={13} /><ShoppingBag size={13} /></>}</div>
    </div>
    <div className="android-preview-note"><Smartphone size={22} /><span className="mono">ANDROID / KOTLIN</span><b>{t(finance ? 'Finanças no seu ritmo.' : 'Da escolha ao pedido.')}</b><p>{t(finance ? 'Contas · investimentos · relatórios' : 'Cardápio · carrinho · gestão')}</p></div>
  </div>;
}
