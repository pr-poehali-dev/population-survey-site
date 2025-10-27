import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const surveys = [
    {
      id: 1,
      title: 'Качество городских услуг',
      description: 'Оцените работу городских служб',
      category: 'Городская среда',
      participants: 1247,
      deadline: '15 ноября 2025',
      questions: [
        {
          id: 1,
          type: 'radio',
          question: 'Как вы оцениваете качество уборки улиц?',
          options: ['Отлично', 'Хорошо', 'Удовлетворительно', 'Плохо']
        },
        {
          id: 2,
          type: 'scale',
          question: 'Насколько вы удовлетворены работой общественного транспорта?',
          min: 1,
          max: 10
        },
        {
          id: 3,
          type: 'text',
          question: 'Какие улучшения вы бы хотели видеть в вашем районе?',
          placeholder: 'Напишите ваши предложения...'
        }
      ]
    }
  ];

  const activeSurvey = surveys[0];
  const totalQuestions = activeSurvey.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSurveyCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = activeSurvey.questions[currentQuestion];

  const mockResults = {
    totalResponses: 1247,
    demographics: {
      age: [
        { range: '18-24', count: 234, percentage: 18.8 },
        { range: '25-34', count: 398, percentage: 31.9 },
        { range: '35-44', count: 312, percentage: 25.0 },
        { range: '45-54', count: 187, percentage: 15.0 },
        { range: '55+', count: 116, percentage: 9.3 }
      ]
    },
    questionResults: [
      {
        question: 'Качество уборки улиц',
        data: [
          { option: 'Отлично', count: 187, percentage: 15.0 },
          { option: 'Хорошо', count: 498, percentage: 39.9 },
          { option: 'Удовлетворительно', count: 374, percentage: 30.0 },
          { option: 'Плохо', count: 188, percentage: 15.1 }
        ]
      }
    ],
    averageRating: 6.8
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="ClipboardList" size={32} className="text-primary" />
              <h1 className="text-2xl font-heading font-bold text-primary">ОпросыОнлайн</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" className="font-medium">
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button variant="ghost" className="font-medium">
                <Icon name="ClipboardCheck" size={18} className="mr-2" />
                Активные опросы
              </Button>
              <Button variant="ghost" className="font-medium">
                <Icon name="BarChart3" size={18} className="mr-2" />
                Результаты
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="results">Результаты</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">
                  {activeSurvey.title}
                </h2>
                <p className="text-muted-foreground text-lg">{activeSurvey.description}</p>
                <div className="flex gap-4 justify-center mt-4 flex-wrap">
                  <Badge variant="secondary" className="px-4 py-1">
                    <Icon name="Users" size={14} className="mr-1" />
                    {activeSurvey.participants} участников
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1">
                    <Icon name="Calendar" size={14} className="mr-1" />
                    До {activeSurvey.deadline}
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1">
                    <Icon name="Tag" size={14} className="mr-1" />
                    {activeSurvey.category}
                  </Badge>
                </div>
              </div>

              {!surveyCompleted ? (
                <Card className="shadow-lg border-0 animate-scale-in">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <CardDescription className="text-base">
                          Вопрос {currentQuestion + 1} из {totalQuestions}
                        </CardDescription>
                        <span className="text-sm font-medium text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <CardTitle className="text-2xl mt-4 font-heading">{currentQ.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentQ.type === 'radio' && (
                      <RadioGroup
                        value={answers[currentQuestion] || ''}
                        onValueChange={handleAnswer}
                        className="space-y-3"
                      >
                        {currentQ.options?.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-blue-50"
                          >
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="flex-1 cursor-pointer text-base">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {currentQ.type === 'scale' && (
                      <div className="space-y-4">
                        <Slider
                          value={[answers[currentQuestion] || 5]}
                          onValueChange={(value) => handleAnswer(value[0])}
                          min={currentQ.min}
                          max={currentQ.max}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{currentQ.min}</span>
                          <span className="text-2xl font-bold text-primary">
                            {answers[currentQuestion] || 5}
                          </span>
                          <span>{currentQ.max}</span>
                        </div>
                      </div>
                    )}

                    {currentQ.type === 'text' && (
                      <Textarea
                        value={answers[currentQuestion] || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder={currentQ.placeholder}
                        className="min-h-32 text-base"
                      />
                    )}

                    <div className="flex justify-between gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="w-32"
                      >
                        <Icon name="ChevronLeft" size={18} className="mr-1" />
                        Назад
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion]}
                        className="w-32"
                      >
                        {currentQuestion === totalQuestions - 1 ? 'Завершить' : 'Далее'}
                        <Icon name="ChevronRight" size={18} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0 text-center py-12 animate-scale-in">
                  <CardContent>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon name="CheckCircle" size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-heading font-bold mb-4">Спасибо за участие!</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Ваши ответы помогут улучшить качество городских услуг
                    </p>
                    <Button onClick={() => window.location.reload()} size="lg">
                      <Icon name="RotateCcw" size={18} className="mr-2" />
                      Пройти другой опрос
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold mb-8 text-center">
                Результаты опроса
              </h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Users" size={24} />
                      Общая статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {mockResults.totalResponses}
                        </div>
                        <div className="text-sm text-muted-foreground">Всего ответов</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {mockResults.averageRating}
                        </div>
                        <div className="text-sm text-muted-foreground">Средняя оценка</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {totalQuestions}
                        </div>
                        <div className="text-sm text-muted-foreground">Вопросов</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="PieChart" size={24} />
                      Распределение ответов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockResults.questionResults[0].data.map((item) => (
                        <div key={item.option} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.option}</span>
                            <span className="text-muted-foreground">
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          <Progress value={item.percentage} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold mb-8 text-center">
                Демографическая статистика
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} />
                    Распределение по возрасту
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockResults.demographics.age.map((item) => (
                      <div key={item.range} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">{item.range} лет</span>
                          <Badge variant="secondary">
                            {item.count} чел. ({item.percentage}%)
                          </Badge>
                        </div>
                        <div className="relative h-12 bg-secondary rounded-lg overflow-hidden">
                          <div
                            className="absolute h-full bg-primary transition-all duration-500 flex items-center justify-end pr-4"
                            style={{ width: `${item.percentage}%` }}
                          >
                            <span className="text-white font-bold">{item.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 ОпросыОнлайн. Платформа для проведения социологических опросов</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Конфиденциальность
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Условия использования
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Поддержка
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
