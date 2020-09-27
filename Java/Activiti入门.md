# Activit入门

**数据库表**

- act_re_*: 这些表包含了流程定义和流程静态资源，如版本，发布名称等。
- act_ru_*: 这些运行时的表，包含流程实例，任务，变量，异步任务，等运行中的数据。 Activiti只在流程实例执行过程中保存这些数据，在流程或任务结束时就会删除这些记录。 
- act_id_*:  这些表包含身份信息，如用户，组等等。
- act_hi_*: 这些表包含历史数据，如历史流程实例，变量，任务等，正在运行的任务和流程也会保存。
- act_ge_*: 通用数据，如存放资源文件，流程保存的自定义类型数据等。

**资源库流程规则表**

1. act_re_deployment 部署信息表
2. act_re_model 流程设计模型部署表
3. act_re_procdef 流程定义数据表

**运行时数据表**

1. act_ru_execution 运行时流程执行实例表
2. act_ru_identitylink 运行时流程人员表，主要存储任务节点与参与者的相关信息
3. act_ru_task 运行时任务节点表
4. act_ru_variable 运行时流程变量数据表

**历史数据表**

1. act_hi_actinst 历史节点表
2. act_hi_attachment 历史附件表
3. act_hi_comment 历史意见表
4. act_hi_identitylink 历史流程人员表
5. act_hi_detail 历史详情表，提供历史变量的查询
6. act_hi_procinst 历史流程实例表
7. act_hi_taskinst 历史任务实例表
8. act_hi_varinst 历史变量表

**用户信息表**

1. act_id_group 用户组信息表
2. act_id_info 用户扩展信息表
3. act_id_membership 用户与用户组对应信息表
4. act_id_user 用户信息表

**通用数据表**

1. act_ge_bytearray 二进制数据表
2. act_ge_property 属性数据表存储整个流程引擎级别的数据



## 常用Service

**RepositoryService**

>  Activiti 中每一个不同版本的业务流程的定义都需要使用一些定义文件，部署文件和支持数据 ( 例如 BPMN2.0 XML 文件，表单定义文件，流程定义图像文件等 )，这些文件都存储在 Activiti 内建的 Repository 中。Repository Service 提供了对 repository 的存取服务。

**RuntimeService**

> Activiti 中，每当一个流程定义被启动一次之后，都会生成一个相应的流程对象实例。Runtime Service 提供了启动流程、查询流程实例、设置获取流程实例变量等功能。此外它还提供了对流程部署，流程定义和流程实例的存取服务。

**TaskService**

> 在 Activiti 中业务流程定义中的每一个执行节点被称为一个 Task，对流程中的数据存取，状态变更等操作均需要在 Task 中完成。Task Service 提供了对用户 Task 和 Form相关的操作。它提供了运行时任务查询、领取、完成、删除以及变量设置等功能。

**IdentityService**

> Activiti 中内置了用户以及组管理的功能，必须使用这些用户和组的信息才能获取到相应的 Task。Identity Service 提供了对 Activiti 系统中的用户和组的管理功能。

**ManagementService**

> Management Service 提供了对 Activiti 流程引擎的管理和维护功能，这些功能不在工作流驱动的应用程序中使用，主要用于 Activiti 系统的日常维护。

**HistoryService**

> History Service 用于获取正在运行或已经完成的流程实例的信息，与 Runtime Service 中获取的流程信息不同，历史信息包含已经持久化存储的永久信息，并已经被针对查询优化。

**FormService**

> Activiti 中的流程和状态 Task 均可以关联业务相关的数据。通过使用 Form Service可以存取启动和完成任务所需的表单数据并且根据需要来渲染表单。



## 相关资料

- [Web-第三十天 Activiti工作流【悟空教程】](https://cloud.tencent.com/developer/article/1178597)
- [《Activiti实战》笔记](https://juejin.im/post/5a4064365188252b145b4560#heading-18)
- [Activiti就是这么简单](https://juejin.im/post/5aafa3eef265da23784015b9)
- [Activiti 5.22.0 API文档](https://www.activiti.org/javadocs/)



## ActivitiListener

activiti使用的时候，通常需要跟业务紧密的结合在一起，有些业务非常的复杂，通常有如下一些场景：

> 1.activiti人员动态的分配。
>
> 2.当前任务节点完成的时候，指定需要指定下一个节点的处理人(比如，一个请假流程，a员工请假，需要指定下一步需要处理请假流程的领导。)。
>
> 3.任务节点完成的时候，需要一些复杂业务，(比如当前节点完成的时候，需要调用我们的jms消息系统发送消息)。
>
> 4.任务流转到当前的节点的时候，需要监控当前任务节点的一些信息或者其他的业务信息。
>
> 5.当前的任务节点分配处理人的时候，需要触发自定义的一些业务。
>
> 6.流程开始结束的时候，需要处理业务信息。
>
> 7.经过任务节点的出线，也就是连线的时候，需要触发自定义的业务。

### **流程监听器**

作用于流程中节点的`START`，`END`，`TAKE`等事件，需要实现`org.activiti.engine.delegate.ExecutionListener`接口并覆写`notify()`方法。

```java
public class CompleteListener implements ExecutionListener {
    private static ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    private RuntimeService runtimeService = processEngine.getRuntimeService();


    @Override
    public void notify(DelegateExecution delegateExecution){
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(delegateExecution.getProcessInstanceId()).singleResult();
        String businessKey = processInstance.getBusinessKey();
        try{
            Integer status = ActivitiUtils.getEntityStatus(businessKey);
            if(status == ProcessStatus.REVIEWING) {
                ActivitiUtils.updateEntityStatus(businessKey, ProcessStatus.COMPLETE);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

### **任务监听器**

作用于Task的`CREATE`，`ASSIGNMENT`，`COMPLETE`，`DELETE`，`ALL_EVENTS`等事件，需要实现`org.activiti.engine.delegate.TaskListener`接口并覆写`notify()`方法。

```java
public class SetLeaderListener implements TaskListener {
    private static ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    private TaskService taskService = processEngine.getTaskService();
    private IdentityService identityService = processEngine.getIdentityService();

    @Override
    public void notify(DelegateTask delegateTask) {
        System.err.println("==========监听执行开始==========");
        String depManagerId = getDepManager();
        //设置处理人
        delegateTask.setVariable("leader",depManagerId);
        System.err.println("==========监听执行结束==========");
    }

    //获取部门经理
    private String getDepManager(){
        String userId = ActivitiUtils.getSysUserId();
        Group group = identityService.createGroupQuery().groupMember(userId).singleResult();
        Group group1 = identityService.createGroupQuery().groupId("部门二").singleResult();
        User user = identityService.createUserQuery().memberOfGroup(group.getId()).memberOfGroup(group1.getId()).singleResult();
        return user.getId();
    }
}
```

**(注：监听方法不能被Spring管理，一般通过ProcessEngines的静态方法`getDefaultProcessengine()`获取ProcessEngine实例然后获取需要的Service)**



## ActivitiProcess

activiti发起流程需要先通过bpmn文件进行部署流程定义，然后通过流程定义并设置唯一businessKey发起流程实例。

### **部署流程**

使用RepositoryService对activiti 的repository 进行操作。通过RepositoryService可以获得流程定义的DeploymentBuilder类

> ```java
> DeploymentBuilder deploymentBuilder = repositoryService.createDeployment()
> ```

DeploymentBuilder可以将指定的流程文件，或者文件流发布为流程定义。并可以设置部署的名称以及种类。

```java
Deployment deploy = deployment
.addClasspathResource("processes/listenerTestProcess.bpmn")
//通过输入流部署
//.addInputStream(resourceName,inputStream)
    .name("监听流程测试")
    .category("监听流程测试")
    .deploy();
```

(**注：被部署流程的Id如果相同，则只会更改之前流程的版本号，新发起的流程实例不会受影响，之后发起的流程实例采用新的流程定义**)

### **发起流程实例**

发起流程得到实例一般有以下两种方式：

方式一：通过流程定义id发起(此处的流程定义id是部署流程定义后act_re_procdef表的ID_字段的值，使用此种方式相对较少)

```java
//设置流程发起人
identityService.setAuthenticatedUserId(userId);
ProcessInstance processInstance = runtimeService.startProcessInstanceById(processDefinitionId,businessKey);
//清空流程发起人
identityService.setAuthenticatedUserId(null);

```



方式二：通过流程Key发起(Key为bpmn文件中的id字段)

```java
//设置流程发起人
identityService.setAuthenticatedUserId(userId);
ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(PROCESSID,businessKey);
//清空流程发起人
identityService.setAuthenticatedUserId(null);
```

(**注：businessKey通常为对应业务表唯一主键，必须保证businessKey在activiti所有表中唯一**)

### **查询流程**

查询流程一般有HistoricProcessInstanceQuery和ProcessInstanceQuery。HistoricProcessInstanceQuery用于查询历史流程和列表查询，ProcessInstanceQuery一般用于查询运行中的流程。获取方式如下：

>```java
>HistoricProcessInstanceQuery historicProcessInstanceQuery = historyService.createHistoricProcessInstanceQuery();
>ProcessInstanceQuery processInstanceQuery = runtimeService.createProcessInstanceQuery();
>
>```

查询我发起的流程：

```java
List<HistoricProcessInstance> historicProcessInstances = historicProcessInstanceQuery
                .startedBy(userId)
                .listPage(currentPage, pageSize);
```

### **获取流程图**

Activiti提供了ProcessDiagramGenerator来获取获取流程图,需要传入BpmnModel和字体版本等信息。BpmnModel通过repositoryService传入流程定义id获取，流程定义id一般通过流程实例获得

```java
 public InputStream getProcessImage(String businessKey) {
        ProcessInstance processInstance = runtimeService
                .createProcessInstanceQuery()
                .processInstanceBusinessKey(businessKey)
                .singleResult();
        assert (processInstance!=null);
        //获取流程图
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
        Context.setProcessEngineConfiguration((ProcessEngineConfigurationImpl) processEngineConfiguration);

        InputStream inputStream = processEngineConfiguration.getProcessDiagramGenerator().generateDiagram(bpmnModel, "png", "宋体",
                "宋体", "宋体", processEngineConfiguration.getClassLoader());
        return imageStream;
    }
```

### **获取流程进度**

如果要获得流程进度，则需要传入需要显示高亮的节点和路线集合

```java
public InputStream getProcessImage(String businessKey) {
        ProcessInstance processInstance = runtimeService
                .createProcessInstanceQuery()
                .processInstanceBusinessKey(businessKey)
                .singleResult();
        assert (processInstance!=null);
        //获取流程图
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
        Context.setProcessEngineConfiguration((ProcessEngineConfigurationImpl) processEngineConfiguration);

        //获取高亮节点集合
        List<HistoricActivityInstance> highLightActivitList =  historyService
                .createHistoricActivityInstanceQuery()
                .processInstanceId(processInstance.getId())
                .list();
        List<String> highLightActivitis = new ArrayList<String>();
        for(HistoricActivityInstance activity : highLightActivitList){
            String activityId = activity.getActivityId();
            highLightActivitis.add(activityId);
        }
        //获取高亮线路集合
        ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity)repositoryService
                .getProcessDefinition(processInstance.getProcessDefinitionId());
        List<String> highLightFlows = ActivitiUtils.getHighLightFlows(definitionEntity,highLightActivitList);

        ProcessDiagramGenerator diagramGenerator = processEngineConfiguration.getProcessDiagramGenerator();
        InputStream imageStream = diagramGenerator.generateDiagram(bpmnModel,
                "png", highLightActivitis,highLightFlows,
                "宋体","宋体","宋体",
                processEngineConfiguration.getClassLoader(),1.0);

        return imageStream;
    }
```

获取高亮

```java
public static List<String> getHighLightFlows(
            ProcessDefinitionEntity processDefinitionEntity,
            List<HistoricActivityInstance> historicActivityInstances) {
        List<String> highFlows = new ArrayList<String>();
        for (int i = 0; i < historicActivityInstances.size() - 1; i++) {
            // 得到节点定义的详细信息
            ActivityImpl activityImpl = processDefinitionEntity
                    .findActivity(historicActivityInstances.get(i)
                            .getActivityId());
            // 用以保存后需开始时间相同的节点
            List<ActivityImpl> sameStartTimeNodes = new ArrayList<ActivityImpl>();
            ActivityImpl sameActivityImpl1 = processDefinitionEntity
                    .findActivity(historicActivityInstances.get(i + 1)
                            .getActivityId());
            // 将后面第一个节点放在时间相同节点的集合里
            sameStartTimeNodes.add(sameActivityImpl1);
            for (int j = i + 1; j < historicActivityInstances.size() - 1; j++) {
                // 后续第一个节点
                HistoricActivityInstance activityImpl1 = historicActivityInstances.get(j);
                // 后续第二个节点
                HistoricActivityInstance activityImpl2 = historicActivityInstances.get(j + 1);
                // 如果第一个节点和第二个节点开始时间相同保存
                if (activityImpl1.getStartTime().equals(activityImpl2.getStartTime())) {
                    ActivityImpl sameActivityImpl2 = processDefinitionEntity
                            .findActivity(activityImpl2.getActivityId());
                    sameStartTimeNodes.add(sameActivityImpl2);
                }// 有不相同跳出循环
                else {
                    break;
                }
            }
            // 取出节点的所有出去的线
            List<PvmTransition> pvmTransitions = activityImpl.getOutgoingTransitions();
            // 对所有的线进行遍历
            for (PvmTransition pvmTransition : pvmTransitions) {
                ActivityImpl pvmActivityImpl = (ActivityImpl) pvmTransition.getDestination();
                // 如果取出的线的目标节点存在时间相同的节点里，保存该线的id，进行高亮显示
                if (sameStartTimeNodes.contains(pvmActivityImpl)) {
                    highFlows.add(pvmTransition.getId());
                }
            }
        }
        return highFlows;
    }
```



## ActivitTask

### **查询任务**

Activiti提供了TaskInfoQuery接口来查询Task，经常使用的接口有如下获取方式：

```java
TaskQuery taskQuery = taskService.createTaskQuery();

HistoricTaskInstanceQuery historicTaskInstanceQuery = historyService.createHistoricTaskInstanceQuery();
```

以上接口均可使用链式调用添加查询条件，如查询某用户在某某时间之前创建的，流程定义的名称包含"XXX"任务并以taskId升序：

```java
taskQuery.taskAssignee(userId)
   		 .taskCreatedAfter(date)
   		 .processDefinitionNameLike(prodiName)
   		 .orderByTaskId(taskId)
  		 .asc()
```

最后可以调用如下方法得到Task对象：

```
  long count();
  U singleResult();
  List<U> list();
  List<U> listPage(int var1, int var2);
```

HistoricTaskInstanceQuery和TaskQuery类似，HistoricTaskInstanceQuery可以通过`finished()`和`unfinished()`方法查询已完成和正在执行的方法。

**注：设置的组任务和多用户任务均没有设置Assignee只能通过`taskCandidate*（）`等方法查询**

### **完成任务**

完成任务之前要先要验证任务处理人和当前登录用户是否为同一个人

```java
public static Task isAbleToComplete(String businessKey){
    ProcessInstance processInstance = runtimeService
        .createProcessInstanceQuery()
        .processInstanceBusinessKey(businessKey)
        .singleResult();
    //流程是否结束
    if(processInstance!=null){
        Task task = taskService
            .createTaskQuery()
            //任务处理人和当前登录用户是否为同一个人
            .taskAssignee(getSysUserId())
            .processInstanceId(processInstance.getId())
            .singleResult();
        if(task!=null);
        return task;
    }
    return null;
}
```

然后调用Task相关Service ，`TaskService` 的`complete()`方法完成任务。

```
taskService.complete(task.getId());
```

完成任务时可以添加变量，如动态传入下一个任务处理人则需要设值传入的参数，然后流程图中用EL表达式获取。

Activiti变量分为

> 局部变量(LocalVariables,当前任务有效，任务完成后在当前流程中失效，但可以通过`HistoryTaskInstance..getTaskLocalVariables()`获取)
>
> 全局变量(Variables，整个流程有效，流程变量名称相同时，后一次的值替换前一次的值)。

通常有以下两种方式：

设置变量

```java
//变量以map形式存入，K为变量名 V支持 Strin,Integer,Short,Long,Double,Boolean,Date,Binary,Serializable等数据类型
Map<String, Object> variablesMap = new HashMap<>();
```

方式一：完成并设置变量

```java
//以全局变量存入
taskService.complete(task.getId(),variablesMap);
//以局部变量存入
taskService.complete(task.getId(),variablesMap，true);
```

方式二：设置变量

```java
//以局部变量存入
taskService.setVariablesLocal(task.getId(),variablesMap)
taskService.setVariableLocal(task.getId(),"变量名",value);
//以全局变量存入
taskService.setVariables(task.getId(),variablesMap)
taskService.setVariable(task.getId(),"变量名",value);
```









