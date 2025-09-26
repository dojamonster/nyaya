import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Globe, 
  Mail, 
  ExternalLink, 
  Heart, 
  Shield, 
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';

const emergencyNumbers = [
  {
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: '24/7 confidential support for domestic violence survivors',
    available: '24/7',
    type: 'emergency'
  },
  {
    name: 'Sexual Assault Hotline',
    number: '1-800-656-4673',
    description: 'Free, confidential support for sexual assault survivors',
    available: '24/7', 
    type: 'emergency'
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free, 24/7 crisis support via text message',
    available: '24/7',
    type: 'emergency'
  }
];

const legalResources = [
  {
    name: 'Legal Aid Society',
    website: 'www.legalaid.org',
    description: 'Free legal assistance for low-income individuals',
    services: ['Legal consultation', 'Court representation', 'Document preparation'],
    type: 'legal'
  },
  {
    name: 'National Women\'s Law Center',
    website: 'www.nwlc.org',
    description: 'Legal advocacy for gender equality and justice',
    services: ['Know your rights', 'Legal resources', 'Policy advocacy'],
    type: 'legal'
  },
  {
    name: 'ACLU Women\'s Rights Project',
    website: 'www.aclu.org/womens-rights',
    description: 'Constitutional protection of women\'s rights',
    services: ['Legal defense', 'Rights education', 'Policy reform'],
    type: 'legal'
  }
];

const counselingServices = [
  {
    name: 'BetterHelp',
    website: 'www.betterhelp.com',
    description: 'Professional online therapy and counseling',
    cost: 'Paid service with financial aid available',
    type: 'counseling'
  },
  {
    name: 'SAMHSA Helpline',
    number: '1-800-662-4357',
    description: 'Free mental health treatment referrals',
    cost: 'Free referral service',
    type: 'counseling'
  },
  {
    name: 'Psychology Today',
    website: 'www.psychologytoday.com',
    description: 'Find therapists and support groups in your area',
    cost: 'Directory service',
    type: 'counseling'
  }
];

const Support = () => {
  const handleCall = (number: string) => {
    window.open(`tel:${number.replace(/[^\d]/g, '')}`);
  };

  const handleVisitWebsite = (website: string) => {
    window.open(`https://${website}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Support Resources</h1>
              <p className="text-muted-foreground">
                Professional help, legal aid, and crisis support when you need it most
              </p>
            </div>
          </div>

          {/* Emergency Warning */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">In Immediate Danger?</h3>
                <p className="text-sm text-destructive/80 mt-1">
                  If you are in immediate danger, call 911 or your local emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Hotlines */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Phone className="h-6 w-6 mr-2 text-primary" />
                Emergency Hotlines
              </h2>
              
              <div className="space-y-4">
                {emergencyNumbers.map((resource, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{resource.name}</span>
                        <div className="flex items-center space-x-1 text-success">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{resource.available}</span>
                        </div>
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleCall(resource.number)}
                        className="w-full"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call {resource.number}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Counseling Services */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-primary" />
                Counseling & Therapy
              </h2>
              
              <div className="space-y-4">
                {counselingServices.map((service, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-200">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{service.cost}</p>
                        <div className="flex space-x-2">
                          {service.number && (
                            <Button 
                              variant="outline"
                              onClick={() => handleCall(service.number)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          )}
                          {service.website && (
                            <Button 
                              variant="outline"
                              onClick={() => handleVisitWebsite(service.website)}
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Visit Website
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Resources */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                Legal Aid & Rights
              </h2>
              
              <div className="space-y-4">
                {legalResources.map((resource, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-200">
                    <CardHeader>
                      <CardTitle>{resource.name}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Services:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {resource.services.map((service, i) => (
                              <li key={i} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => handleVisitWebsite(resource.website)}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit {resource.website}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Local Resources */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-primary" />
                Find Local Help
              </h2>
              
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Location-Based Resources</CardTitle>
                  <CardDescription>
                    Find support services, shelters, and legal aid in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.211.org', '_blank')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call 211 for Local Resources
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.thehotline.org/get-help/domestic-violence-local-resources/', '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Local Domestic Violence Resources
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://www.womenslaw.org/find-help', '_blank')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Women's Law Resource Directory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Remember: You Are Not Alone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Safety First</h4>
              <p className="text-muted-foreground">
                Your safety is the top priority. Trust your instincts and reach out for help when needed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Confidential Support</h4>
              <p className="text-muted-foreground">
                All listed resources provide confidential support. Your privacy and safety are protected.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">No Judgment</h4>
              <p className="text-muted-foreground">
                These services are designed to help without judgment. You deserve support and respect.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;