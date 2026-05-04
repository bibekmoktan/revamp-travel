'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { User, ShoppingCart, Heart, LogOut, CalendarCheck, Settings, ChevronRight, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import logo from '../../../public/icons/logo.jpg';
import HeroSearch from './HeroSearch';

const categories = [
    {
        name: 'Trekking in Nepal',
        href: '/trekking?activity=trekking',
        subItems: [
            { name: 'Everest Base Camp Trek – 14 Days',      href: '/trekking?activity=trekking&searchTerm=everest+base+camp' },
            { name: 'Annapurna Circuit Trek – 15 Days',      href: '/trekking?activity=trekking&searchTerm=annapurna+circuit' },
            { name: 'Langtang Valley Trek – 10 Days',        href: '/trekking?activity=trekking&searchTerm=langtang' },
            { name: 'Gokyo Lakes Trek – 12 Days',            href: '/trekking?activity=trekking&searchTerm=gokyo' },
            { name: 'Manaslu Circuit Trek – 14 Days',        href: '/trekking?activity=trekking&searchTerm=manaslu' },
            { name: 'Upper Mustang Trek – 14 Days',          href: '/trekking?activity=trekking&searchTerm=upper+mustang' },
        ],
    },
    {
        name: 'Climbing & Expedition',
        href: '/trekking?activity=climbing',
        subItems: [
            { name: 'Island Peak Climbing – 18 Days',        href: '/trekking?activity=climbing&searchTerm=island+peak' },
            { name: 'Mera Peak Climbing – 19 Days',          href: '/trekking?activity=climbing&searchTerm=mera+peak' },
            { name: 'Lobuche Peak Climbing – 20 Days',       href: '/trekking?activity=climbing&searchTerm=lobuche' },
            { name: 'Everest Expedition – 60 Days',          href: '/trekking?activity=climbing&searchTerm=everest+expedition' },
        ],
    },
    {
        name: 'Luxury Treks',
        href: '/trekking?activity=luxury-trek',
        subItems: [
            { name: 'Luxury Everest Base Camp – 14 Days',    href: '/trekking?activity=luxury-trek&searchTerm=luxury+everest' },
            { name: 'Luxury Annapurna – 12 Days',            href: '/trekking?activity=luxury-trek&searchTerm=luxury+annapurna' },
            { name: 'Heli & Trek Combo – 10 Days',           href: '/trekking?activity=luxury-trek&searchTerm=heli+trek' },
        ],
    },
    {
        name: 'Cultural Tour & Sightseeing',
        href: '/trekking?activity=cultural-tour',
        subItems: [
            { name: 'Kathmandu Valley Tour – 3 Days',        href: '/trekking?activity=cultural-tour&searchTerm=kathmandu+valley' },
            { name: 'Pokhara Sightseeing – 2 Days',          href: '/trekking?activity=cultural-tour&searchTerm=pokhara' },
            { name: 'Lumbini Pilgrimage – 3 Days',           href: '/trekking?activity=cultural-tour&searchTerm=lumbini' },
            { name: 'UNESCO Heritage Tour – 4 Days',         href: '/trekking?activity=cultural-tour&searchTerm=unesco' },
        ],
    },
    {
        name: 'Cycling & Mountain Biking',
        href: '/trekking?activity=cycling',
        subItems: [
            { name: 'Kathmandu Valley Cycling – 1 Day',      href: '/trekking?activity=cycling&searchTerm=kathmandu+cycling' },
            { name: 'Annapurna Cycling Tour – 12 Days',      href: '/trekking?activity=cycling&searchTerm=annapurna+cycling' },
            { name: 'Mountain Biking to Nagarkot – 1 Day',   href: '/trekking?activity=cycling&searchTerm=nagarkot+biking' },
        ],
    },
    {
        name: 'Luxury Tours',
        href: '/trekking?activity=luxury-tour',
        subItems: [
            { name: 'Nepal Luxury Package – 10 Days',        href: '/trekking?activity=luxury-tour&searchTerm=nepal+luxury' },
            { name: 'Private Heli Tour – Everest – 1 Day',   href: '/trekking?activity=luxury-tour&searchTerm=heli+tour' },
            { name: 'Luxury Nepal & Tibet – 14 Days',        href: '/trekking?activity=luxury-tour&searchTerm=nepal+tibet' },
        ],
    },
    {
        name: 'Day Trips',
        href: '/trekking?activity=day-trip',
        subItems: [
            { name: 'Day Tour to UNESCO Heritage Sites – 1 Day',   href: '/trekking?activity=day-trip&searchTerm=unesco+heritage' },
            { name: 'Nagarkot Sunrise Tour – 1 Day',               href: '/trekking?activity=day-trip&searchTerm=nagarkot+sunrise' },
            { name: 'Dhulikhel & Namobuddha Day Tour – 1 Day',    href: '/trekking?activity=day-trip&searchTerm=dhulikhel' },
            { name: 'Changunarayan Temple Day Tour – 1 Day',       href: '/trekking?activity=day-trip&searchTerm=changunarayan' },
        ],
    },
    {
        name: 'Multi Country Tours',
        href: '/trekking?activity=multi-country',
        subItems: [
            { name: 'Nepal & Tibet Tour – 12 Days',          href: '/trekking?activity=multi-country&searchTerm=nepal+tibet' },
            { name: 'Nepal & Bhutan Tour – 14 Days',         href: '/trekking?activity=multi-country&searchTerm=nepal+bhutan' },
            { name: 'Nepal, India & Tibet – 18 Days',        href: '/trekking?activity=multi-country&searchTerm=nepal+india+tibet' },
        ],
    },
    {
        name: 'Voluntourism Trips',
        href: '/trekking?activity=voluntourism',
        subItems: [
            { name: 'Teaching Volunteer Program – 2 Weeks',  href: '/trekking?activity=voluntourism&searchTerm=teaching' },
            { name: 'Orphanage Volunteer – 1 Week',          href: '/trekking?activity=voluntourism&searchTerm=orphanage' },
            { name: 'Environmental Conservation – 2 Weeks',  href: '/trekking?activity=voluntourism&searchTerm=conservation' },
        ],
    },
    {
        name: 'Extend Your Trip',
        href: '/trekking?activity=extend',
        subItems: [
            { name: 'Bardiya Jungle Safari – 4 Days',                   href: '/trekking?activity=extend&searchTerm=bardiya' },
            { name: 'Chitwan Jungle Safari – 3 Days',                   href: '/trekking?activity=extend&searchTerm=chitwan' },
            { name: 'One Day Biking Trip – Kathmandu – 1 Day',          href: '/trekking?activity=extend&searchTerm=biking+kathmandu' },
            { name: 'Trishuli River Rafting – 1 Day',                   href: '/trekking?activity=extend&searchTerm=trishuli+rafting' },
            { name: 'Paragliding in Nepal (Pokhara) – 1 Day',          href: '/trekking?activity=extend&searchTerm=paragliding' },
            { name: 'Ultra Light Flight – 1 Day',                       href: '/trekking?activity=extend&searchTerm=ultra+light+flight' },
            { name: 'Scenic Mountain Flight (Everest Flight) – 1 Day', href: '/trekking?activity=extend&searchTerm=everest+flight' },
            { name: 'Day Tour to UNESCO Heritage Sites – 1 Day',        href: '/trekking?activity=extend&searchTerm=unesco+day+tour' },
        ],
    },
];

const trekkingRegions = [
    {
        name: 'Everest Region',
        href: '/trekking?activity=trekking&searchTerm=everest',
        subItems: [
            { name: 'Everest View Heli Trek – 8 Days',                          href: '/trekking?searchTerm=everest+view+heli' },
            { name: 'Everest Base Camp Trek without Lukla Flight – 17 Days',    href: '/trekking?searchTerm=ebc+without+lukla' },
            { name: 'Luxury Everest Base Camp Heli Trek – 11 Days',             href: '/trekking?searchTerm=luxury+ebc+heli' },
            { name: 'Gokyo to Everest Base Camp Trek – 17 Days',                href: '/trekking?searchTerm=gokyo+ebc' },
            { name: 'Everest Base Camp Heli Trek – 11 Days',                    href: '/trekking?searchTerm=ebc+heli' },
            { name: 'Mt Everest Base Camp to Gokyo Trek – 19 Days',             href: '/trekking?searchTerm=ebc+gokyo' },
            { name: 'Everest Panorama Trek – 9 Days',                           href: '/trekking?searchTerm=everest+panorama' },
            { name: 'Gokyo to Everest Base Camp Trek with Heli Return – 15 Days', href: '/trekking?searchTerm=gokyo+ebc+heli' },
            { name: 'Everest Base Camp Trek with Helicopter Return – 12 Days',  href: '/trekking?searchTerm=ebc+helicopter+return' },
            { name: 'Everest Base Camp with Island Peak – 19 Days',             href: '/trekking?searchTerm=ebc+island+peak' },
            { name: 'Everest Base Camp Trek – 14 Days',                         href: '/trekking?searchTerm=everest+base+camp+14' },
            { name: 'Everest Three Passes Trek – 20 Days',                      href: '/trekking?searchTerm=everest+three+passes' },
            { name: 'Everest Base Camp Luxury Trek – 14 Days',                  href: '/trekking?searchTerm=ebc+luxury' },
            { name: 'Everest High Passes and Island Peak – 23 Days',            href: '/trekking?searchTerm=everest+high+passes' },
            { name: 'Gokyo Lake Trek – 13 Days',                                href: '/trekking?searchTerm=gokyo+lake' },
            { name: 'Classical Everest Base Camp Trek – 21 Days',               href: '/trekking?searchTerm=classical+ebc' },
            { name: 'Gokyo and Renjo La Pass Trek – 14 Days',                   href: '/trekking?searchTerm=gokyo+renjo' },
            { name: 'VIP Everest Base Camp Trek – 10 Days',                     href: '/trekking?searchTerm=vip+ebc' },
        ],
    },
    {
        name: 'Annapurna Region',
        href: '/trekking?activity=trekking&searchTerm=annapurna',
        subItems: [
            { name: 'Annapurna Base Camp Trek – 12 Days',           href: '/trekking?searchTerm=annapurna+base+camp' },
            { name: 'Annapurna Circuit Trek – 15 Days',             href: '/trekking?searchTerm=annapurna+circuit' },
            { name: 'Poon Hill Trek – 5 Days',                      href: '/trekking?searchTerm=poon+hill' },
            { name: 'Mardi Himal Trek – 7 Days',                    href: '/trekking?searchTerm=mardi+himal' },
            { name: 'Annapurna Panorama Trek – 7 Days',             href: '/trekking?searchTerm=annapurna+panorama' },
            { name: 'Annapurna Circuit with Tilicho Lake – 18 Days', href: '/trekking?searchTerm=annapurna+tilicho' },
        ],
    },
    {
        name: 'Langtang Region',
        href: '/trekking?activity=trekking&searchTerm=langtang',
        subItems: [
            { name: 'Langtang Valley Trek – 10 Days',               href: '/trekking?searchTerm=langtang+valley' },
            { name: 'Gosaikunda Lake Trek – 10 Days',               href: '/trekking?searchTerm=gosaikunda' },
            { name: 'Helambu Trek – 8 Days',                        href: '/trekking?searchTerm=helambu' },
            { name: 'Langtang Gosaikunda Helambu Trek – 15 Days',   href: '/trekking?searchTerm=langtang+gosaikunda+helambu' },
        ],
    },
    {
        name: 'Manaslu Region',
        href: '/trekking?activity=trekking&searchTerm=manaslu',
        subItems: [
            { name: 'Manaslu Circuit Trek – 14 Days',               href: '/trekking?searchTerm=manaslu+circuit' },
            { name: 'Tsum Valley Trek – 20 Days',                   href: '/trekking?searchTerm=tsum+valley' },
            { name: 'Manaslu Tsum Valley Trek – 22 Days',           href: '/trekking?searchTerm=manaslu+tsum' },
        ],
    },
    {
        name: 'Mustang Region',
        href: '/trekking?activity=trekking&searchTerm=mustang',
        subItems: [
            { name: 'Upper Mustang Trek – 14 Days',                 href: '/trekking?searchTerm=upper+mustang' },
            { name: 'Lower Mustang Trek – 9 Days',                  href: '/trekking?searchTerm=lower+mustang' },
            { name: 'Muktinath Trek – 12 Days',                     href: '/trekking?searchTerm=muktinath' },
        ],
    },
    {
        name: 'Dhaulagiri Region',
        href: '/trekking?activity=trekking&searchTerm=dhaulagiri',
        subItems: [
            { name: 'Dhaulagiri Circuit Trek – 22 Days',            href: '/trekking?searchTerm=dhaulagiri+circuit' },
            { name: 'Dhaulagiri Base Camp Trek – 16 Days',          href: '/trekking?searchTerm=dhaulagiri+base+camp' },
        ],
    },
    {
        name: 'Dolpo Region',
        href: '/trekking?activity=trekking&searchTerm=dolpo',
        subItems: [
            { name: 'Upper Dolpo Trek – 28 Days',                   href: '/trekking?searchTerm=upper+dolpo' },
            { name: 'Lower Dolpo Trek – 20 Days',                   href: '/trekking?searchTerm=lower+dolpo' },
            { name: 'Phoksundo Lake Trek – 14 Days',                href: '/trekking?searchTerm=phoksundo+lake' },
        ],
    },
    {
        name: 'Kanchenjunga Region',
        href: '/trekking?activity=trekking&searchTerm=kanchenjunga',
        subItems: [
            { name: 'Kanchenjunga Base Camp Trek – 24 Days',        href: '/trekking?searchTerm=kanchenjunga+base+camp' },
            { name: 'Kanchenjunga North Base Camp – 22 Days',       href: '/trekking?searchTerm=kanchenjunga+north' },
            { name: 'Kanchenjunga Circuit Trek – 28 Days',          href: '/trekking?searchTerm=kanchenjunga+circuit' },
        ],
    },
];

const activityCountries = [
    {
        name: 'Nepal',
        href: '/activities?country=nepal',
        subItems: [
            { name: 'Trekking',            href: '/activities?country=nepal&type=trekking' },
            { name: 'Mountaineering',      href: '/activities?country=nepal&type=mountaineering' },
            { name: 'Paragliding',         href: '/activities?country=nepal&type=paragliding' },
            { name: 'White Water Rafting', href: '/activities?country=nepal&type=rafting' },
            { name: 'Jungle Safari',       href: '/activities?country=nepal&type=safari' },
            { name: 'Bungee Jumping',      href: '/activities?country=nepal&type=bungee' },
            { name: 'Mountain Biking',     href: '/activities?country=nepal&type=biking' },
            { name: 'Yoga & Meditation',   href: '/activities?country=nepal&type=yoga' },
            { name: 'Zip Lining',          href: '/activities?country=nepal&type=ziplining' },
            { name: 'Rock Climbing',       href: '/activities?country=nepal&type=rock-climbing' },
            { name: 'Kayaking',            href: '/activities?country=nepal&type=kayaking' },
            { name: 'Scenic Mountain Flight', href: '/activities?country=nepal&type=scenic-flight' },
        ],
    },
    {
        name: 'Bhutan',
        href: '/activities?country=bhutan',
        subItems: [
            { name: 'Trekking',            href: '/activities?country=bhutan&type=trekking' },
            { name: 'Cultural Tours',      href: '/activities?country=bhutan&type=cultural' },
            { name: 'Archery Experience',  href: '/activities?country=bhutan&type=archery' },
            { name: 'Cycling',             href: '/activities?country=bhutan&type=cycling' },
            { name: 'Bird Watching',       href: '/activities?country=bhutan&type=birdwatching' },
            { name: 'Yoga & Meditation',   href: '/activities?country=bhutan&type=yoga' },
            { name: 'River Rafting',       href: '/activities?country=bhutan&type=rafting' },
            { name: 'Zip Lining',          href: '/activities?country=bhutan&type=ziplining' },
            { name: 'Dzong Monastery Tour',href: '/activities?country=bhutan&type=monastery' },
            { name: 'Hot Stone Bath',      href: '/activities?country=bhutan&type=hotstone' },
        ],
    },
    {
        name: 'Tibet',
        href: '/activities?country=tibet',
        subItems: [
            { name: 'Trekking',            href: '/activities?country=tibet&type=trekking' },
            { name: 'Cultural Tours',      href: '/activities?country=tibet&type=cultural' },
            { name: 'Pilgrimage Tours',    href: '/activities?country=tibet&type=pilgrimage' },
            { name: 'Mt. Kailash Tour',    href: '/activities?country=tibet&type=kailash' },
            { name: 'Cycling',             href: '/activities?country=tibet&type=cycling' },
            { name: 'Monastery Visits',    href: '/activities?country=tibet&type=monastery' },
            { name: 'Hot Springs',         href: '/activities?country=tibet&type=hotsprings' },
            { name: 'Scenic Drives',       href: '/activities?country=tibet&type=scenic' },
            { name: 'Yak Safari',          href: '/activities?country=tibet&type=yak-safari' },
            { name: 'Lake Namtso Trek',    href: '/activities?country=tibet&type=namtso' },
        ],
    },
];

const companyLinks = [
    { name: 'Company Info',  href: '/about' },
    { name: 'Travel Guide',  href: '/travel-guide' },
    { name: 'Blog',          href: '/blog' },
    { name: 'Meet Our Team', href: '/our-team' },
];

export default function Navbar() {
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [trekkingMenuOpen, setTrekkingMenuOpen] = useState(false);
    const [activeTrekkingRegionIndex, setActiveTrekkingRegionIndex] = useState(0);
    const [activitiesOpen, setActivitiesOpen] = useState(false);
    const [activeActivityIndex, setActiveActivityIndex] = useState(0);
    const [destinationsOpen, setDestinationsOpen] = useState(false);
    const [companyOpen, setCompanyOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { count: cartCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const router = useRouter();
    const profileRef = useRef<HTMLDivElement>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const trekkingCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activitiesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const destCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const companyCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function openMegaMenu() {
        if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
        setMegaMenuOpen(true);
    }
    function closeMegaMenuDelayed() {
        megaCloseTimer.current = setTimeout(() => setMegaMenuOpen(false), 150);
    }
    function openTrekkingMenu() {
        if (trekkingCloseTimer.current) clearTimeout(trekkingCloseTimer.current);
        setTrekkingMenuOpen(true);
    }
    function closeTrekkingMenuDelayed() {
        trekkingCloseTimer.current = setTimeout(() => setTrekkingMenuOpen(false), 150);
    }
    function openDestinations() {
        if (destCloseTimer.current) clearTimeout(destCloseTimer.current);
        setDestinationsOpen(true);
    }
    function closeDestinationsDelayed() {
        destCloseTimer.current = setTimeout(() => setDestinationsOpen(false), 150);
    }
    function openActivities() {
        if (activitiesCloseTimer.current) clearTimeout(activitiesCloseTimer.current);
        setActivitiesOpen(true);
    }
    function closeActivitiesDelayed() {
        activitiesCloseTimer.current = setTimeout(() => setActivitiesOpen(false), 150);
    }
    function openCompany() {
        if (companyCloseTimer.current) clearTimeout(companyCloseTimer.current);
        setCompanyOpen(true);
    }
    function closeCompanyDelayed() {
        companyCloseTimer.current = setTimeout(() => setCompanyOpen(false), 150);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        logout();
        setProfileOpen(false);
        router.push('/');
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            {/* Top Bar */}
            <div className="bg-[#607D8B] w-full">
                <div className="max-w-[1366px] mx-auto px-6 md:px-8 h-10 flex items-center justify-between text-white text-sm">
                    {/* Left — Social + Contact */}
                    <div className="flex items-center gap-5">
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                        </Link>
                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </Link>
                        <Link href="https://wa.me/61481712113" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white/80 transition">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </Link>

                        <span className="text-white/40">|</span>

                        <Link href="tel:+61481712113" className="flex items-center gap-1.5 hover:text-white/80 transition">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
                            </svg>
                            +61481712113
                        </Link>

                        <span className="text-white/40">|</span>

                        <Link href="mailto:info@highspiritsnepal.com" className="flex items-center gap-1.5 hover:text-white/80 transition">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            info@highspiritsnepal.com
                        </Link>
                    </div>

                    {/* Right — Wishlist, Cart, Profile/Login */}
                    <div className="flex items-center gap-4">
                        <Link href="/wishlist" aria-label="Wishlist" className="relative hover:text-white/80 transition">
                            <Heart className="w-4 h-4" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-sky-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                    {wishlistCount > 9 ? '9+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="relative hover:text-white/80 transition">
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-sky-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <span className="text-white/40">|</span>

                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(o => !o)}
                                    className="flex items-center gap-2 hover:text-white/80 transition focus:outline-none"
                                    aria-label="Profile menu"
                                >
                                    <div className="w-7 h-7 rounded-full bg-sky-400 text-white font-bold text-xs flex items-center justify-center uppercase select-none">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-xs hidden sm:block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                                        <div className="px-4 py-3 bg-sky-50 border-b border-gray-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-bold text-sm flex items-center justify-center uppercase shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                                                <User className="w-4 h-4 text-gray-400" />
                                                My Profile
                                            </Link>
                                            <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                                                <CalendarCheck className="w-4 h-4 text-gray-400" />
                                                My Bookings
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                                                    <Settings className="w-4 h-4 text-gray-400" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 py-1">
                                            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" aria-label="Login" className="flex items-center gap-1.5 hover:text-white/80 transition text-xs">
                                <User className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="bg-white border-b border-gray-200 shadow-sm w-full">
                <nav className="flex items-center justify-between w-full px-6 md:px-8 h-[80px] max-w-[1366px] mx-auto gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                        <div className="relative w-12 h-12">
                            <Image src={logo} alt="Himalayan Highspirits Adventure logo" fill className="object-contain" priority />
                        </div>
                        <span className="flex flex-col leading-tight">
                            <span className="text-[15px] font-bold text-sky-900">Himalayan High</span>
                            <span className="text-[15px] font-bold text-sky-900 tracking-wide">Spirits Adventure</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-700 shrink-0">
                        {/* Trips — triggers mega menu */}
                        <div
                            className="relative"
                            onMouseEnter={openMegaMenu}
                            onMouseLeave={closeMegaMenuDelayed}
                        >
                            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition focus:outline-none hover:bg-gray-100 hover:text-sky-700`}>
                                Trips
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {/* Trekking — triggers region mega menu */}
                        <div
                            className="relative"
                            onMouseEnter={openTrekkingMenu}
                            onMouseLeave={closeTrekkingMenuDelayed}
                        >
                            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition focus:outline-none hover:bg-gray-100 hover:text-sky-700`}>
                                Trekking
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${trekkingMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {/* Activities — triggers mega menu */}
                        <div
                            className="relative"
                            onMouseEnter={openActivities}
                            onMouseLeave={closeActivitiesDelayed}
                        >
                            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition focus:outline-none hover:bg-gray-100 hover:text-sky-700`}>
                                Activities
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activitiesOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {/* Destinations dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={openDestinations}
                            onMouseLeave={closeDestinationsDelayed}
                        >
                            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition focus:outline-none hover:bg-gray-100 hover:text-sky-700`}>
                                Destinations
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${destinationsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute top-full left-0 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 transition-all duration-200 ease-out origin-top ${destinationsOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
                                onMouseEnter={openDestinations}
                                onMouseLeave={closeDestinationsDelayed}
                            >
                                {[
                                    { name: 'Nepal',  href: '/destinations/nepal' },
                                    { name: 'Bhutan', href: '/destinations/bhutan' },
                                    { name: 'Tibet',  href: '/destinations/tibet' },
                                    { name: 'India',  href: '/destinations/india' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setDestinationsOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F4C81] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Company dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={openCompany}
                            onMouseLeave={closeCompanyDelayed}
                        >
                            <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition focus:outline-none hover:bg-gray-100 hover:text-sky-700`}>
                                Company
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                className={`absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 transition-all duration-200 ease-out origin-top ${companyOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'}`}
                                onMouseEnter={openCompany}
                                onMouseLeave={closeCompanyDelayed}
                            >
                                {companyLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setCompanyOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F4C81] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="hidden lg:block flex-1 max-w-[340px]">
                        <HeroSearch />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/contact-us"
                            className="hidden md:flex px-5 h-[40px] items-center justify-center text-sm font-semibold bg-sky-700 text-white hover:bg-sky-800 transition whitespace-nowrap"
                        >
                            Quick Inquiry
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                            aria-label="Toggle mobile menu"
                        >
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <div className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* ── Trips Mega Menu ─────────────────────────────────────────────── */}
            <div
                ref={megaMenuRef}
                className={`hidden lg:block fixed top-[120px] left-0 w-full z-40 bg-white border-t border-gray-100 shadow-xl transition-all duration-200 ease-out ${megaMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                onMouseEnter={openMegaMenu}
                onMouseLeave={closeMegaMenuDelayed}
            >
                <div className="max-w-[1320px] mx-auto px-6 md:px-16 flex" style={{ minHeight: 420 }}>
                    <div className="w-64 shrink-0 border-r border-gray-100 py-4">
                        {categories.map((cat, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveCategoryIndex(i)}
                                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeCategoryIndex === i ? 'bg-gray-50 text-[#0F4C81] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0F4C81]'}`}
                            >
                                <Link href={cat.href} className="flex-1" onClick={() => setMegaMenuOpen(false)}>
                                    {cat.name}
                                </Link>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${activeCategoryIndex === i ? 'text-[#0F4C81]' : 'text-gray-300'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 py-6 px-8">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                            {categories[activeCategoryIndex].name}
                        </p>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                            {categories[activeCategoryIndex].subItems.map((item, j) => (
                                <Link
                                    key={j}
                                    href={item.href}
                                    onClick={() => setMegaMenuOpen(false)}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0F4C81] py-2 border-b border-gray-50 transition-colors group"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F4C81] shrink-0 transition-colors" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Trekking Regions Mega Menu ──────────────────────────────────── */}
            <div
                className={`hidden lg:block fixed top-[120px] left-0 w-full z-40 bg-white border-t border-gray-100 shadow-xl transition-all duration-200 ease-out ${trekkingMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                onMouseEnter={openTrekkingMenu}
                onMouseLeave={closeTrekkingMenuDelayed}
            >
                <div className="max-w-[1320px] mx-auto px-6 md:px-16 flex" style={{ minHeight: 400 }}>
                    <div className="w-64 shrink-0 border-r border-gray-100 py-4">
                        {trekkingRegions.map((region, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveTrekkingRegionIndex(i)}
                                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeTrekkingRegionIndex === i ? 'bg-gray-50 text-[#0F4C81] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0F4C81]'}`}
                            >
                                <Link href={region.href} className="flex-1" onClick={() => setTrekkingMenuOpen(false)}>
                                    {region.name}
                                </Link>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${activeTrekkingRegionIndex === i ? 'text-[#0F4C81]' : 'text-gray-300'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 py-6 px-8 flex flex-col">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                            {trekkingRegions[activeTrekkingRegionIndex].name}
                        </p>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-0 flex-1">
                            {trekkingRegions[activeTrekkingRegionIndex].subItems.map((item, j) => (
                                <Link
                                    key={j}
                                    href={item.href}
                                    onClick={() => setTrekkingMenuOpen(false)}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0F4C81] py-2 border-b border-gray-50 transition-colors group"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F4C81] shrink-0 transition-colors" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-5 border-t border-gray-100 mt-4">
                            <Link
                                href={trekkingRegions[activeTrekkingRegionIndex].href}
                                onClick={() => setTrekkingMenuOpen(false)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F4C81] text-white text-sm font-semibold hover:bg-sky-800 transition-colors rounded-lg"
                            >
                                View All {trekkingRegions[activeTrekkingRegionIndex].name} Treks
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Activities Mega Menu ────────────────────────────────────── */}
            <div
                className={`hidden lg:block fixed top-[120px] left-0 w-full z-40 bg-white border-t border-gray-100 shadow-xl transition-all duration-200 ease-out ${activitiesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                onMouseEnter={openActivities}
                onMouseLeave={closeActivitiesDelayed}
            >
                <div className="max-w-[1320px] mx-auto px-6 md:px-16 flex" style={{ minHeight: 360 }}>
                    <div className="w-64 shrink-0 border-r border-gray-100 py-4">
                        {activityCountries.map((country, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveActivityIndex(i)}
                                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${activeActivityIndex === i ? 'bg-gray-50 text-[#0F4C81] font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#0F4C81]'}`}
                            >
                                <Link href={country.href} className="flex-1" onClick={() => setActivitiesOpen(false)}>
                                    {country.name}
                                </Link>
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${activeActivityIndex === i ? 'text-[#0F4C81]' : 'text-gray-300'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 py-6 px-8">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                            {activityCountries[activeActivityIndex].name}
                        </p>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                            {activityCountries[activeActivityIndex].subItems.map((item, j) => (
                                <Link
                                    key={j}
                                    href={item.href}
                                    onClick={() => setActivitiesOpen(false)}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#0F4C81] py-2 border-b border-gray-50 transition-colors group"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F4C81] shrink-0 transition-colors" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden w-full bg-white shadow-lg border-t border-gray-200 animate-slideDown">
                    <div className="px-6 py-6 max-w-[1320px] mx-auto space-y-4">
                        <HeroSearch />

                        {user ? (
                            <div className="flex items-center gap-3 py-3 border-b border-gray-100 mb-2">
                                <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-bold text-sm flex items-center justify-center uppercase shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        ) : null}

                        <Link href="/packages" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Trips</Link>
                        <Link href="/trekking" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Trekking</Link>
                        <Link href="/activities" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Activities</Link>
                        {[
                            { name: 'Nepal',  href: '/destinations/nepal' },
                            { name: 'Bhutan', href: '/destinations/bhutan' },
                            { name: 'Tibet',  href: '/destinations/tibet' },
                            { name: 'India',  href: '/destinations/india' },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>{item.name}</Link>
                        ))}
                        {companyLinks.map((item) => (
                            <Link key={item.href} href={item.href} className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>{item.name}</Link>
                        ))}

                        {user ? (
                            <>
                                <Link href="/profile" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>My Profile</Link>
                                <Link href="/profile" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>My Bookings</Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="block text-gray-900 hover:text-sky-700 transition py-2 text-lg font-medium" onClick={closeMobileMenu}>Admin Panel</Link>
                                )}
                            </>
                        ) : null}

                        <Link href="/contact-us" className="block bg-sky-700 text-white hover:bg-sky-800 rounded-xl px-6 py-3 text-center font-semibold transition" onClick={closeMobileMenu}>Quick Inquiry</Link>

                        {user ? (
                            <button
                                onClick={() => { handleLogout(); closeMobileMenu(); }}
                                className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-500 hover:bg-red-50 rounded-xl px-6 py-3 font-semibold transition"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        ) : (
                            <Link href="/login" className="block bg-gray-900 text-white hover:bg-black rounded-xl px-6 py-3 text-center font-semibold transition" onClick={closeMobileMenu}>Login</Link>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
                .animate-slideDown { animation: slideDown 0.3s ease-out; }
            `}</style>
        </header>
    );
}
