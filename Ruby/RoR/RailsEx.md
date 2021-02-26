# Rake Task

通过`Rails`生成`task`

```bash
 > rails generate task my_namespace mytask1 mytask2
```

执行后会生成文件`lib/tasks/my_namespace.rake`。其内容如下：

```ruby
namespace :my_namespace do
  desc "TODO"
  task mytask1: :environment do
  end

  desc "TODO"
  task mytask2: :environment do
  end

end
```

修改内容：

```ruby
desc "Hello work！"
task mytask1: :environment do
  p "Hello work!!"
end
```

执行：

```bash
> rake my_namespace:mytask1
"Hello work!!"
```



# RSpec Rails

`ActionController::TestCase::ActiveSupport::TestCase`

```ruby
require 'rails_helper'

RSpec.describe Api::SchoolsController, type: :controller do
  render_views

  # 1.获取学校以及课程列表
  describe 'GET #index' do
    it 'responds successfully with an Status 20000 code' do

      user = User.first
      user_session_key, token = login_user!(user)

      params = {
        format: :json,
        access_token: token,
        user_session_key: user_session_key,
        page: '1',
        per: '6'
      }
      get :index, params
      p '************************************************************************'
      p JSON.parse(response.body)
      p '************************************************************************'
      code = JSON.parse(response.body)['status']['code']
      expect_success(code)

      get_result = JSON.parse(response.body)['data']['schools']
      schools = School.all
      expect_result = JSON.parse(ApplicationController.render(
          template: 'api/schools/index',
          assigns: { schools: schools }
      ))['data']['schools']
      expect(get_result == expect_result).to eq(true)
    end
  end
end
```

