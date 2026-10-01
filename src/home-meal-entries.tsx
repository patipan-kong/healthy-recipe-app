import { ChevronRight, Shuffle, Store, Utensils } from 'lucide-react'
import { everydayMeals } from './everyday-meals'
import { restaurantMenuItems, restaurants } from './restaurants'
import type { Locale } from './types'
import './home-meal-entries.css'

export function HomeMealEntries({ locale, onRestaurants, onMeals, onRandomRestaurant, onRandomMeal }: {
  locale: Locale
  onRestaurants: () => void
  onMeals: () => void
  onRandomRestaurant: () => void
  onRandomMeal: () => void
}) {
  const th = locale === 'th'
  return <>
    <div className="home-entry-pair">
      <button type="button" className="home-entry meal-hub-buy" onClick={onRestaurants}>
        <Store size={24} aria-hidden="true" /><strong>{th ? 'ร้านอาหาร' : 'Restaurants'}</strong>
        <span>{th ? `${restaurants.length} ร้าน · ${restaurantMenuItems.length} เมนู` : `${restaurants.length} restaurants · ${restaurantMenuItems.length} menu items`}</span>
        <b>{th ? 'ดูร้านทั้งหมด' : 'Browse restaurants'} <ChevronRight size={16} aria-hidden="true" /></b>
      </button>
      <button type="button" className="home-entry" onClick={onMeals}>
        <Utensils size={24} aria-hidden="true" /><strong>{th ? 'เมนูทั่วไป' : 'Everyday Meals'}</strong>
        <span>{th ? `Everyday Meals · ${everydayMeals.length} เมนู` : `${everydayMeals.length} meals`}</span>
        <b>{th ? 'ดูเมนูทั้งหมด' : 'Browse meals'} <ChevronRight size={16} aria-hidden="true" /></b>
      </button>
    </div>
    <h2 className="home-random-heading">{th ? 'มื้อนี้ลอง...' : 'For this meal, try...'}</h2>
    <div className="home-entry-pair home-random-pair">
      <button type="button" className="home-entry" onClick={onRandomRestaurant}><Shuffle size={22} aria-hidden="true" /><strong>{th ? 'สุ่มร้านให้หน่อย' : 'Pick a restaurant'}</strong><span>{th ? `จาก ${restaurants.length} ร้าน` : `From ${restaurants.length} restaurants`}</span></button>
      <button type="button" className="home-entry" onClick={onRandomMeal}><Utensils size={22} aria-hidden="true" /><strong>{th ? 'สุ่มเมนูให้หน่อย' : 'Pick an Everyday Meal'}</strong><span>{th ? `จาก ${everydayMeals.length} เมนู` : `From ${everydayMeals.length} meals`}</span></button>
    </div>
  </>
}
