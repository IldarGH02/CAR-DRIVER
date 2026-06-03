// client/src/pages/Privacy/Privacy.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui/card';

export function Privacy() {
    return (
        <div className="flex-1 overflow-auto bg-background">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Политика конфиденциальности</h2>
                    <p className="text-muted-foreground">
                        Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>1. Общие положения</CardTitle>
                        <CardDescription>
                            Настоящая Политика конфиденциальности описывает, как GoTrack собирает, использует и защищает вашу личную информацию.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">1.1. Определения</h3>
                            <p className="text-muted-foreground">
                                <strong>GoTrack</strong> — сервис для учёта поездок, расчёта топлива и амортизации автомобиля (сайт: https://gotrack.ru).<br />
                                <strong>Оператор</strong> — лицо, осуществляющее обработку персональных данных.<br />
                                <strong>Пользователь</strong> — лицо, зарегистрированное в сервисе GoTrack.<br />
                                <strong>Персональные данные</strong> — информация, которую пользователь предоставляет при регистрации и использовании сервиса.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">2. Какие данные мы собираем</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                <li>Имя, фамилия пользователя</li>
                                <li>Адрес электронной почты</li>
                                <li>Информация об автомобиле (модель, год выпуска, государственный номер)</li>
                                <li>Данные о поездках (маршруты, пробег, расход топлива, амортизация)</li>
                                <li>Строка расходов (опционально, указывается пользователем)</li>
                                <li>IP-адрес и данные об использовании сервиса</li>
                                <li>Файлы cookie и аналогичные технологии</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">3. Как мы используем ваши данные</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                <li>Для предоставления функционала сервиса (учёт поездок, расчёты амортизации)</li>
                                <li>Для генерации отчётов (PDF, Excel)</li>
                                <li>Для улучшения работы сервиса и пользовательского опыта</li>
                                <li>Для отправки уведомлений и сообщений, связанных с использованием сервиса</li>
                                <li>Для аналитики и статистики использования сервиса</li>
                                <li>Для выполнения требований законодательства РФ</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">4. Правовые основания обработки</h3>
                            <p className="text-muted-foreground">
                                Обработка персональных данных осуществляется на основании:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Согласия пользователя, предоставляемого при регистрации</li>
                                <li>Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
                                <li>Исполнения договора, стороной которого является пользователь</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">5. Защита данных</h3>
                            <p className="text-muted-foreground">
                                Мы принимаем все необходимые организационные и технические меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Использование HTTPS-шифрования</li>
                                <li>Хеширование паролей (bcrypt)</li>
                                <li>JWT-токены для аутентификации</li>
                                <li>Регулярное обновление программного обеспечения</li>
                                <li>Ограниченный доступ к данным сотрудников</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">6. Передача данных третьим лицам</h3>
                            <p className="text-muted-foreground">
                                Мы не передаём ваши персональные данные третьим лицам, за исключением случаев:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Предусмотренных законодательством РФ (по запросу суда, правоохранительных органов)</li>
                                <li>Для обеспечения работы сервиса (хостинг-провайдеры, сервисы отправки email)</li>
                                <li>С явного согласия пользователя</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                Трансграничная передача персональных данных не осуществляется.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">7. Сроки хранения данных</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                <li>Персональные данные хранятся до тех пор, пока вы используете сервис</li>
                                <li>После удаления аккаунта данные хранятся в течение 30 дней, после чего удаляются безвозвратно</li>
                                <li>Данные о поездках хранятся до удаления пользователем или до удаления аккаунта</li>
                                <li>Файлы cookie хранятся в соответствии с настройками браузера (до 1 года)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">8. Использование файлов cookie</h3>
                            <p className="text-muted-foreground">
                                GoTrack использует файлы cookie для улучшения работы сервиса. Виды cookie:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li><strong>Необходимые</strong> — обеспечивают базовую функциональность (аутентификация)</li>
                                <li><strong>Аналитические</strong> — помогают анализировать использование сервиса (можно отключить)</li>
                                <li><strong>Маркетинговые</strong> — используются для персонализации рекламы (можно отключить)</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                Вы можете управлять файлами cookie через настройки браузера или через специальное уведомление на сайте.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">9. Ваши права</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                <li>Право на доступ к вашим персональным данным</li>
                                <li>Право на исправление неточных данных</li>
                                <li>Право на удаление данных (право на забвение)</li>
                                <li>Право на ограничение обработки данных</li>
                                <li>Право на перенос данных</li>
                                <li>Право на отзыв согласия на обработку данных</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">10. Как отозвать согласие</h3>
                            <p className="text-muted-foreground">
                                Вы можете отозвать согласие на обработку персональных данных в любое время:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Через настройки аккаунта (удаление профиля)</li>
                                <li>Направив запрос на email: privacy@gotrack.ru</li>
                                <li>Через форму обратной связи в приложении</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                После отзыва согласия мы прекратим обработку ваших данных и удалим аккаунт в течение 30 дней.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">11. Контактная информация</h3>
                            <p className="text-muted-foreground">
                                По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>📧 Email: privacy@gotrack.ru</li>
                                <li>🌐 Сайт: https://gotrack.ru</li>
                                <li>📱 Telegram: @gotrack_support</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">12. Изменения политики конфиденциальности</h3>
                            <p className="text-muted-foreground">
                                Мы можем периодически обновлять настоящую Политику конфиденциальности. О всех изменениях мы уведомляем пользователей:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Через уведомления в приложении</li>
                                <li>По электронной почте (при важных изменениях)</li>
                                <li>Путём размещения новой версии на сайте</li>
                            </ul>
                            <p className="text-muted-foreground mt-2">
                                Новая редакция Политики вступает в силу с момента её размещения.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-2">13. Уполномоченный орган</h3>
                            <p className="text-muted-foreground">
                                Контроль за соблюдением законодательства о персональных данных осуществляет:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                <li>Федеральная служба по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор)</li>
                                <li>Адрес: 109074, Москва, Китайгородский проезд, д. 7, стр. 2</li>
                                <li>Сайт: https://rkn.gov.ru</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}