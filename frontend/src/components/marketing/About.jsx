import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Container from '../ui/Container';
import Text from '../ui/Text';
import FadeIn from '@/src/animations/fade-in';

const About = () => {
  return (
    <section id="about" className="bg-background py-16">
      <Container className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
          About <span className="text-logo-gradient">Donezo</span>
        </h2>

        {/* Introduction */}
        <Card className="mt-8 bg-card shadow-lg">
          <CardHeader>
            <Text className="text-xl font-semibold">Hello, I'm Abhijit!</Text>
          </CardHeader>
          <CardContent>
            <FadeIn>
              <Text className="text-muted-foreground">
                I’m <span className="font-semibold">Abhijit Upadhyay</span>, the sole developer behind <span className="font-semibold text-logo-gradient">Donezo</span>—a simple yet powerful task management platform designed to help teams and individuals stay organized effortlessly.
              </Text>
              <Text className="mt-4 text-muted-foreground">
                I built <span className="text-logo-gradient font-semibold">Donezo</span> as a free, open-source project to offer an alternative to traditional task management tools. It’s designed to be minimal, straightforward, and flexible for different types of workflows, whether you're using it as a kanban board or a to-do list.
              </Text>
              {/* Why Donezo? */}
              <div className="mt-10">
                <h3 className="text-3xl font-semibold text-foreground">Why <span className="text-logo-gradient">Donezo</span>?</h3>
                <Text className="mt-4 text-muted-foreground">
                  I wanted a tool that could keep things simple and help with personal organization without all the complexity. I didn’t want to build something bloated or behind a paywall, so I created <span className="font-semibold">Donezo</span>—a free and easy-to-use platform for managing tasks.
                </Text>
              </div>
              {/* Let's Build It Together! */}
              <div className="mt-10">
                <h3 className="text-3xl font-semibold text-foreground"><span className='text-logo-gradient'>Contribute</span> to Donezo</h3>
                <Text className="mt-4 text-muted-foreground">
                  <span className="font-semibold">Donezo</span> is an open-source project, contributions are welcome! If you have ideas, feature requests, or suggestions, feel free to{' '}
                  <a href="https://github.com/Nutty1704/taskmanager" target="_blank" rel="noopener noreferrer" className="font-semibold text-logo-gradient hover:text-logo-gradient-light">
                    contribute on GitHub
                  </a>.
                </Text>
              </div>
            </FadeIn>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
};

export default About;
