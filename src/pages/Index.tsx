import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const [currentSurveyId, setCurrentSurveyId] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://functions.poehali.dev/a8b02780-46dc-4291-9a31-590566247c56';

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/?action=stats&survey_id=${currentSurveyId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin, currentSurveyId]);

  const submitSurvey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surveyId: currentSurveyId,
          answers: answers
        })
      });
      const data = await response.json();
      if (data.success) {
        setSurveyCompleted(true);
        loadStats();
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Ошибка при отправке опроса');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Неверный пароль');
    }
  };

  const surveys = [
    {
      id: 1,
      title: 'Удовлетворенность населения занятиями физкультурой и спортом',
      description: 'Анкета для проведения опроса',
      category: 'Спорт и здоровье',
      participants: 0,
      deadline: '30 ноября 2025',
      questions: [
        {
          id: 1,
          type: 'radio',
          question: '1. Пол',
          options: ['1. мужской', '2. женский']
        },
        {
          id: 2,
          type: 'text',
          question: '2. Сколько лет Вам исполнилось?',
          placeholder: 'Напишите число полных лет респондента'
        },
        {
          id: 3,
          type: 'radio',
          question: '3. Занимаетесь Вы или Ваш ребенок в спортивной организации?',
          options: [
            '1. Занимаюсь сам;',
            '2. Занимается ребенок;',
            '3. Занимаюсь и сам и занимается ребенок;',
            '4. Затрудняюсь ответить.'
          ]
        },
        {
          id: 4,
          type: 'radio',
          question: '4. Как часто Вы или Ваш ребенок посещаете в спортивную организацию?',
          options: [
            '1. 1 – 2 раза в месяц;',
            '2. от 1 до 2 раза в неделю;',
            '3. более 3 раз в неделю;',
            '4. Иное'
          ]
        },
        {
          id: 5,
          type: 'radio',
          question: '5. Какие виды услуг Вы или Ваш ребенок получаете в спортивной организации?',
          options: [
            '1. Платные физкультурно-оздоровительные услуги (групповые занятия, индивидуальные посещения);',
            '2. Спортивная подготовка на безвозмездной основе;',
            '3. Спортивная подготовка на платной основе;',
            '4. Бесплатные/ платные физкультурно-оздоровительные услуги (групповые занятия, индивидуальные посещения);',
            '5. Иное'
          ]
        },
        {
          id: 6,
          type: 'matrix',
          question: '6. Насколько Вы удовлетворены следующими условиями для занятий в спортивной организации:',
          rows: [
            '1. Возможность выбора занятий в соответствии со своими интересами',
            '2. Оборудование, санитарно-гигиеническое состояние мест занятий',
            '3. Материально-техническая оснащенность мест занятий (наличие и состояние спортивного оборудования и инвентаря)',
            '4. Удобное расписание предоставления услуг',
            '5. Профессионализм и отношение тренерского состава',
            '6. Доступность информации о проводимых физкультурно-спортивных мероприятиях',
            '7. Безопасность посещения спортивных объектов'
          ],
          columns: [
            'Полностью удовлетворён',
            'Скорее удовлетворён',
            'Скорее не удовлетворён',
            'Совершенно не удовлетворён',
            'Затрудняюсь ответить'
          ]
        }
      ]
    }
  ];

  const activeSurvey = surveys.find(s => s.id === currentSurveyId) || surveys[0];
  const totalQuestions = activeSurvey.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitSurvey();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = activeSurvey.questions[currentQuestion];

  const displayStats = stats || {
    totalResponses: 0,
    demographics: {
      age: [
        { range: '18-24', count: 0, percentage: 0 },
        { range: '25-34', count: 0, percentage: 0 },
        { range: '35-44', count: 0, percentage: 0 },
        { range: '45-54', count: 0, percentage: 0 },
        { range: '55+', count: 0, percentage: 0 }
      ]
    },
    questionResults: [
      {
        question: 'Удовлетворенность занятиями',
        data: []
      }
    ],
    averageRating: 0
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
            <nav className="hidden md:flex gap-6 items-center">
              <Button variant="ghost" className="font-medium">
                <Icon name="ClipboardCheck" size={18} className="mr-2" />
                Активные опросы
              </Button>
              {isAdmin ? (
                <>
                  <Button variant="ghost" className="font-medium">
                    <Icon name="BarChart3" size={18} className="mr-2" />
                    Результаты
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAdmin(false)}
                  >
                    <Icon name="LogOut" size={16} className="mr-1" />
                    Выход
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAdminLogin(true)}
                >
                  <Icon name="Lock" size={16} className="mr-1" />
                  Администратор
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className={`grid w-full max-w-md mx-auto ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'} mb-8`}>
            <TabsTrigger value="active">Активные</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="results">Результаты</TabsTrigger>
                <TabsTrigger value="stats">Статистика</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="active" className="animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {surveys.map((survey) => (
                    <Card 
                      key={survey.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        currentSurveyId === survey.id ? 'border-primary border-2 shadow-md' : ''
                      }`}
                      onClick={() => {
                        setCurrentSurveyId(survey.id);
                        setCurrentQuestion(0);
                        setAnswers({});
                        setSurveyCompleted(false);
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <CardDescription>{survey.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            <Icon name="Users" size={12} className="mr-1" />
                            {stats?.totalResponses || 0}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Icon name="Calendar" size={12} className="mr-1" />
                            До {survey.deadline}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {survey.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-heading font-bold mb-2 text-foreground">
                    {activeSurvey.title}
                  </h2>
                  <p className="text-muted-foreground">{activeSurvey.description}</p>
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

                    {currentQ.type === 'matrix' && (
                      <div className="space-y-4 overflow-x-auto">
                        <div className="min-w-[600px]">
                          <div className="grid grid-cols-6 gap-2 mb-4">
                            <div className="col-span-1"></div>
                            {currentQ.columns?.map((col, idx) => (
                              <div key={idx} className="text-center text-xs font-medium text-muted-foreground px-2">
                                {col}
                              </div>
                            ))}
                          </div>
                          {currentQ.rows?.map((row, rowIdx) => (
                            <div key={rowIdx} className="grid grid-cols-6 gap-2 mb-3 items-center p-2 rounded-lg hover:bg-blue-50 transition-colors">
                              <div className="col-span-1 text-sm pr-4">{row}</div>
                              <RadioGroup
                                value={answers[currentQuestion]?.[rowIdx] || ''}
                                onValueChange={(value) => {
                                  const matrixAnswers = answers[currentQuestion] || {};
                                  handleAnswer({ ...matrixAnswers, [rowIdx]: value });
                                }}
                                className="contents"
                              >
                                {currentQ.columns?.map((col, colIdx) => (
                                  <div key={colIdx} className="flex justify-center">
                                    <RadioGroupItem
                                      value={colIdx.toString()}
                                      id={`${rowIdx}-${colIdx}`}
                                    />
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </div>
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
                        disabled={
                          isLoading || (currentQ.type === 'matrix' 
                            ? !answers[currentQuestion] || Object.keys(answers[currentQuestion]).length !== currentQ.rows?.length
                            : !answers[currentQuestion])
                        }
                        className="w-32"
                      >
                        {isLoading ? 'Отправка...' : (currentQuestion === totalQuestions - 1 ? 'Завершить' : 'Далее')}
                        {!isLoading && <Icon name="ChevronRight" size={18} className="ml-1" />}
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
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => {
                          setCurrentQuestion(0);
                          setAnswers({});
                          setSurveyCompleted(false);
                        }} 
                        size="lg" 
                        variant="outline"
                      >
                        <Icon name="RotateCcw" size={18} className="mr-2" />
                        Пройти заново
                      </Button>
                      <Button 
                        onClick={() => {
                          const nextSurvey = surveys.find(s => s.id !== currentSurveyId);
                          if (nextSurvey) {
                            setCurrentSurveyId(nextSurvey.id);
                            setCurrentQuestion(0);
                            setAnswers({});
                            setSurveyCompleted(false);
                          }
                        }} 
                        size="lg"
                      >
                        <Icon name="ListChecks" size={18} className="mr-2" />
                        Другой опрос
                      </Button>
                    </div>
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
                          {displayStats.totalResponses}
                        </div>
                        <div className="text-sm text-muted-foreground">Всего ответов</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {displayStats.averageRating}
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
                      {displayStats.questionResults[0]?.data?.length > 0 ? (
                        displayStats.questionResults[0].data.map((item: any) => (
                          <div key={item.option} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.option}</span>
                              <span className="text-muted-foreground">
                                {item.count} ({item.percentage}%)
                              </span>
                            </div>
                            <Progress value={item.percentage} className="h-3" />
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          Пока нет ответов на этот вопрос
                        </p>
                      )}
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
                    {displayStats.demographics.age.map((item) => (
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

      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход для администратора</DialogTitle>
            <DialogDescription>
              Введите пароль для доступа к результатам и статистике
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAdminLogin();
                }
              }}
            />
            <Button onClick={handleAdminLogin} className="w-full">
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;