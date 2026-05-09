import Nav from '@/components/nav';
import Hero from '@/components/hero';
import Story from '@/components/story';
import Menu from '@/components/menu';
import Space from '@/components/space';
import { Brunch, Traiteur } from '@/components/brunch';
import { Visit, Footer } from '@/components/visit';

export default function Page() {
  return (
    <div id="top">
      <Nav />
      <Hero />
      <Story />
      <Menu />
      <Space />
      <Brunch />
      <Traiteur />
      <Visit />
      <Footer />
    </div>
  );
}
