'use client';

import { Button, Form, Input, InputNumber, Typography } from 'antd';
import Image from 'next/image';

interface IComment {
  text: string;
}

interface IPosts {
  title: string;
  description: string;
  comments: IComment[];
}

interface IForm {
  fullName: string;
  age: number;
  description?: string;
  posts: IPosts[];
}

export default function Home() {
  const onFinish = (values: IForm) => {
    localStorage.setItem('User_Info:', JSON.stringify(values));
  };

  return (
    <div className="w-1/2 h-screen flex flex-col gap-6 m-auto items-center justify-center">
      <Typography.Title>Создание профиля</Typography.Title>
      <Form name="user_info" onFinish={onFinish} className="w-full">
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Необходимо заполнить поле' }]}
        >
          <Input placeholder="Введи ФИО" className="text-lg" />
        </Form.Item>
        <Form.Item
          name="age"
          rules={[
            {
              required: true,
              validator(_, value) {
                if (!value || Number(value) < 18 || Number(value) > 40) {
                  return Promise.reject('Возраст должен быть не менее 18 и не более 40 лет');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber placeholder="Введи возраст" className="text-lg w-full" />
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea placeholder="Введи описание" className="text-lg resize-none" autoSize />
        </Form.Item>
        <Form.List
          name="posts"
          initialValue={[
            {
              title: '',
              description: '',
              comments: [
                {
                  text: '',
                },
              ],
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="flex flex-col gap-4 mb-4">
                  <div className="flex justify-between items-center">
                    <Typography.Title level={4}>Пост {index + 1}</Typography.Title>
                    {fields.length > 1 && (
                      <Button danger onClick={() => remove(name)}>
                        Удалить пост
                      </Button>
                    )}
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    rules={[{ required: true, message: 'Введите заголовок поста' }]}
                  >
                    <Input placeholder="Заголовок поста" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, 'description']}>
                    <Input.TextArea placeholder="Описание поста" autoSize className="resize-none" />
                  </Form.Item>

                  <Form.List name={[name, 'comments']}>
                    {(commentFields, { add: addComment, remove: removeComment }) => (
                      <>
                        {commentFields.map(
                          ({ key: commentKey, name: commentName, ...restCommentField }) => (
                            <div key={commentKey} className="flex items-center gap-2">
                              <Form.Item
                                {...restCommentField}
                                name={[commentName, 'text']}
                                className="flex-1"
                                rules={[
                                  {
                                    required: true,
                                    validator(_, value) {
                                      if (!value || value.length > 20) {
                                        return Promise.reject(
                                          'Комментарий должен быть не более 20 символов',
                                        );
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Input placeholder="Комментарий" />
                              </Form.Item>
                              <Button danger onClick={() => removeComment(commentName)}>
                                Удалить
                              </Button>
                            </div>
                          ),
                        )}
                        <Button type="dashed" onClick={() => addComment()} block>
                          Добавить комментарий
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    title: '',
                    description: '',
                    comments: [
                      {
                        text: '',
                      },
                    ],
                  })
                }
                block
                className="mb-4"
              >
                Добавить пост
              </Button>
            </>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit">
          Подтвердить
        </Button>
        <Button htmlType="reset">Сбросить</Button>
      </Form>
    </div>
  );
}
