import React from 'react';

interface HeaderProps {
  title: string;
  counter: number;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
      <p>{props.counter}</p>
    </header>
  )
}

export default Header;