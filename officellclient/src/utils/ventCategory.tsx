import {  FaUsers,  FaBiohazard, FaRegAddressBook,  FaRegSadTear, FaExclamationTriangle } from "react-icons/fa";
import {MdOutlineLaptopChromebook,  MdOutlineLocalFireDepartment } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiEye } from "react-icons/fi";

export const categories = [
  { name: "Toxic Culture", icon: <FaBiohazard /> }, // bullying, politics, unethical practices
  { name: "Colleague Drama", icon: <FaUsers /> }, // coworkers, backstabbing, gossip
  { name: "Salary Secrets", icon: <BiMoney /> }, // pay gaps, unfair raises, hidden perks
  { name: "WFH Reality", icon: <MdOutlineLaptopChromebook /> }, // remote work stress or freedom
  { name: "Office Romance", icon: <FiEye /> }, // love, affairs, power dynamics
  { name: "HR Tales", icon: <FaRegAddressBook /> }, // how HR actually behaves
  { name: "The Burnout Zone", icon: <MdOutlineLocalFireDepartment /> }, // mental health & stress
  { name: "Layoff Stories", icon: <FaRegSadTear /> }, // layoffs, sudden terminations
  { name: "Whistleblower", icon: <FaExclamationTriangle/> }, // serious ethics/confession posts
];

