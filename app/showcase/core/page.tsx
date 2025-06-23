'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function CoreShowcasePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-light via-purple-light to-magenta-light bg-clip-text text-transparent">
            Core Components Showcase
          </h1>
          <p className="text-base-500 text-lg">
            Essential shadcn/ui components styled with the Flexoki color system
          </p>
        </div>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-200">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" alt="Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>Sarah Chen</CardTitle>
                <CardDescription>Senior Product Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">5 years</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Profile</Button>
              </CardFooter>
            </Card>

            {/* Project Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>FreelancerOS Dashboard</CardTitle>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <CardDescription>
                  Modern dashboard for freelance project management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-xs">MK</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-xs">+3</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-sm text-muted-foreground">5 team members</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind</Badge>
              </CardFooter>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Stats</CardTitle>
                <CardDescription>Your performance this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-green-light">12</div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-blue-light">$8.2k</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-purple-light">94%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-orange-light">156h</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-light rounded-full"></div>
                  <span>+12% from last month</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Input & Label Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-200">Input & Label Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" defaultValue="FreelancerOS Dashboard" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input id="budget" type="number" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="normal">Normal State</Label>
                  <Input id="normal" placeholder="Type something..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filled">Filled State</Label>
                  <Input id="filled" defaultValue="This field has content" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled State</Label>
                  <Input id="disabled" placeholder="Cannot edit this" disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-200">Badge Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badge Variants</CardTitle>
                <CardDescription>Different badge styles for various use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Indicators</CardTitle>
                <CardDescription>Common status badges in applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Project Status</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Status</span>
                    <Badge>Paid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Priority Level</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Review Status</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Avatar Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-200">Avatar Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avatar Sizes</CardTitle>
                <CardDescription>Different avatar sizes for various contexts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" />
                    <AvatarFallback className="text-sm">MD</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" />
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop" />
                    <AvatarFallback className="text-lg">XL</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>Avatar examples with images and fallbacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Product Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Michael Johnson</div>
                      <div className="text-sm text-muted-foreground">Frontend Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Alex Liu</div>
                      <div className="text-sm text-muted-foreground">Backend Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Emma Rodriguez</div>
                      <div className="text-sm text-muted-foreground">UX Researcher</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Component Summary */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-base-950/50 to-base-900/50 border-base-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-light to-purple-light bg-clip-text text-transparent">
                Core Components Summary
              </CardTitle>
              <CardDescription className="text-base">
                Essential building blocks for modern applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-light">Card</div>
                  <div className="text-sm text-muted-foreground">Flexible containers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-light">Input</div>
                  <div className="text-sm text-muted-foreground">Form controls</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-light">Label</div>
                  <div className="text-sm text-muted-foreground">Accessible labels</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-light">Badge</div>
                  <div className="text-sm text-muted-foreground">Status indicators</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-magenta-light">Avatar</div>
                  <div className="text-sm text-muted-foreground">User representation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}